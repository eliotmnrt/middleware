using Apache.NMS;
using Apache.NMS.ActiveMQ;
using ItineraryServer;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ItineraryServer
{
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "Service1" à la fois dans le code et le fichier de configuration.
    public class StationService : IStationService
    {
        Regex coordsRegex = new Regex(@"/^-?\d{1,2}\.\d+$/", RegexOptions.Compiled);
        HttpClient client = new HttpClient();
        String apiKey = "&apiKey=1b6b6bf226341d91b3d0749ee3d52a71049b7a17";
        String urlContracts = "https://api.jcdecaux.com/vls/v3/contracts?";
        String urlStation = "https://api.jcdecaux.com/vls/v3/stations";
        String urlRoadBike = "https://api.openrouteservice.org/v2/directions/cycling-regular?api_key=5b3ce3597851110001cf62482e4596c77c6c41079fbec41de976c380";
        String urlRoadFoot = "https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf62482e4596c77c6c41079fbec41de976c380";
        String urlDataGouv = "https://api-adresse.data.gouv.fr/search/";

        List<Contract> allContracts = null;
        ISession session = null;

        public String GetItinerary(string address1, string address2)
        {
            if (address1 == null || address2 == null)
            {
                return "error departure or arrival";
            }
            setUp();
            var coords1 = (0.0, 0.0);
            var coords2 = (0.0, 0.0);
            if (!coordsRegex.IsMatch(address1) || !coordsRegex.IsMatch(address2))
            {
                coords1 = GetCoordinates(address1).Result;
                coords2 = GetCoordinates(address2).Result;
            } else
            {
                coords1 = ParseCoordinates(address1);
                coords2 = ParseCoordinates(address2);
            }
            

            // Find nearest JCDecaux stations
            var station1 = GetNearestStation(coords1).Result;
            var station2 = GetNearestStation(coords2).Result;
            
            // Generate route between stations
            var route1 = GetFootRoute(coords1, station1).Result;
            var route2 = GetBikeRoute(station1, station2).Result;
            var route3 = GetFootRoute(station2, coords2).Result;

            var footPath = GetFootRoute(coords1, coords2).Result;

            List<Feature> rep = new List<Feature>();
            double total = route1.features[0].properties.summary.duration + route2.features[0].properties.summary.duration + route3.features[0].properties.summary.duration;

            Trace.WriteLine(total);
            Trace.WriteLine(footPath.features[0].properties.summary.duration);
            if (footPath.features[0].properties.summary.duration < route1.features[0].properties.summary.duration + route2.features[0].properties.summary.duration + route3.features[0].properties.summary.duration)
            {
                Trace.WriteLine("Chemin à pied plus court");
                rep.Add(footPath.features[0]);
            } else
            {
                Trace.WriteLine("Chemin à velo plus court");
                rep.Add(route1.features[0]);
                rep.Add(route2.features[0]);
                rep.Add(route3.features[0]);
            }

            SendToQueue(JsonSerializer.Serialize(rep));

            return "succesfull";
        }



        public void setUp()
        {
            allContracts = getAllContracts().Result;

            try
            {
                // Créer une connexion à ActiveMQ
                Uri connectUri = new Uri("tcp://localhost:61616");
                ConnectionFactory connectionFactory = new ConnectionFactory(connectUri);
                IConnection connection = connectionFactory.CreateConnection();
                connection.Start();

                session = connection.CreateSession();
                
                Trace.WriteLine($"connected to activeMq");
            }
            catch (Exception ex)
            {
                    Trace.WriteLine(ex);
            }
        }


        private void SendToQueue(string messageContent)
        {
            try
            {
                IDestination destination = session.GetQueue("itineraryQueue");

                // Créer un producteur pour cette queue
                using (IMessageProducer producer = session.CreateProducer(destination))
                {
                    Trace.WriteLine("hellooooooooooooooooooooo");

                    producer.DeliveryMode = MsgDeliveryMode.NonPersistent;

                    // Créer et envoyer le message
                    ITextMessage message = session.CreateTextMessage(messageContent);
                    producer.Send(message);
                    Trace.WriteLine("message envoyé " + message);
                }
            }
            catch (Exception ex)
            {
                Trace.WriteLine(ex);
            }
        }

        public async Task<List<Contract>> getAllContracts()
        {
            HttpResponseMessage response = await client.GetAsync(urlContracts + apiKey);
            response.EnsureSuccessStatusCode();
            string responseBody = await response.Content.ReadAsStringAsync();
            List<Contract> allContracts = JsonSerializer.Deserialize<List<Contract>>(responseBody);
            allContracts.ForEach(contrat => Trace.WriteLine(contrat.ToString()));
            List<Contract> contractWithStations = new List<Contract>();
            foreach (Contract contract in allContracts)
            {
                string url = urlStation + "?contract=" + contract.name + apiKey;
                HttpResponseMessage stationResponse = await client.GetAsync(url);
                var allStations = await stationResponse.Content.ReadAsStringAsync();
                List<Station> stationsOfContract = JsonSerializer.Deserialize<List<Station>>(allStations);
                if( stationsOfContract != null)
                {
                    if (stationsOfContract.Count > 0)
                    {
                        contractWithStations.Add(contract);
                    }
                    else
                    {
                        Trace.WriteLine("No station : " + contract.ToString());
                    }
                }
                else
                {
                    Trace.WriteLine("erreur json : " + contract.ToString());
                }
            }
            return contractWithStations;

        }

        private async Task<(double lat, double lon)> GetCoordinates(string address)
        {
            var client = new HttpClient();
            String start = address.Replace(" ", "+");
            String url = urlDataGouv + "?q=" + start + "&limit=1";
            String response = await client.GetStringAsync(url);
            GeoFeatureCollection result = JsonSerializer.Deserialize<GeoFeatureCollection>(response);
            return (result.features[0].geometry.coordinates[1], result.features[0].geometry.coordinates[0]); //inversion lat/long
        }

        private async Task<(double lat, double lon)> GetNearestStation((double lat, double lon) coords)
        {
            var client = new HttpClient();
            var nearestContract = GetNearestContract(coords).Result;
            Trace.WriteLine("nearest contract" + nearestContract.ToString());
            string url = urlStation + "?contract=" + nearestContract.name + apiKey;
            HttpResponseMessage stations = await client.GetAsync(url);
            var allStations = await stations.Content.ReadAsStringAsync();
            List<Station> stationsOfContract = JsonSerializer.Deserialize<List<Station>>(allStations);

            Station nearestStation = null;
            double nearestDistance = double.MaxValue;

            foreach (Station station in stationsOfContract)
            {
                double distance = GetDistance(coords, (station.position.latitude, station.position.longitude));
                if (distance < nearestDistance)
                {
                    nearestDistance = distance;
                    nearestStation = station;
                }
            }
            Trace.WriteLine("nearest station" + nearestStation.ToString());
            return (nearestStation.position.latitude, nearestStation.position.longitude);
        }

        private async Task<Contract> GetNearestContract((double lat, double lon) coords)
        {
            Contract nearestContract = null;
            double nearestDistance = double.MaxValue;

            foreach (Contract contract in allContracts)
            {
                if (contract.cities != null && contract.country_code == "FR")
                {
                    foreach (String city in contract.cities)
                    {
                        string url = urlDataGouv + "?q=" + city + "&limit=1";
                        HttpResponseMessage response = await client.GetAsync(url);
                        string responseBody = await response.Content.ReadAsStringAsync();
                        var results = JsonSerializer.Deserialize<GeoFeatureCollection>(responseBody);
                        if (results == null)
                            throw new Exception($"No coordinates found for city: {city}");

                        var cityCoords = (results.features[0].geometry.coordinates[1], results.features[0].geometry.coordinates[0]); //inversion lat/long
                        double distance = GetDistance(coords, cityCoords);

                        if (distance < nearestDistance)
                        {
                            nearestDistance = distance;
                            nearestContract = contract;
                        }
                    }
                }
            }
            return nearestContract;
        }

        private double GetDistance((double lat, double lon) point1, (double lat, double lon) point2)
        {
            const double EarthRadius = 6371e3; // Rayon de la Terre en mètres

            double lat1Rad = DegreesToRadians(point1.lat);
            double lat2Rad = DegreesToRadians(point2.lat);
            double deltaLat = DegreesToRadians(point2.lat - point1.lat);
            double deltaLon = DegreesToRadians(point2.lon - point1.lon);

            double a = Math.Sin(deltaLat / 2) * Math.Sin(deltaLat / 2) +
                       Math.Cos(lat1Rad) * Math.Cos(lat2Rad) *
                       Math.Sin(deltaLon / 2) * Math.Sin(deltaLon / 2);

            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return EarthRadius * c;
        }

        private double DegreesToRadians(double degrees)
        {
            return degrees * (Math.PI / 180);
        }

        private async Task<RouteResponse> GetFootRoute((double lat, double lon) station1, (double lat, double lon) station2)
        {
            var client = new HttpClient();
            string url = $"{urlRoadFoot}&start={station1.lon.ToString(CultureInfo.InvariantCulture)},{station1.lat.ToString(CultureInfo.InvariantCulture)}&end={station2.lon.ToString(CultureInfo.InvariantCulture)},{station2.lat.ToString(CultureInfo.InvariantCulture)}";
            Trace.WriteLine(url);
            var response = await client.GetStringAsync(url);
            RouteResponse road = JsonSerializer.Deserialize<RouteResponse>(response);
            Trace.WriteLine(road.ToString());

            // Parse response and extract route instructions (simplified for brevity)
            return road; // Example response
        }
        private async Task<RouteResponse> GetBikeRoute((double lat, double lon) station1, (double lat, double lon) station2)
        {
            var client = new HttpClient();
            string url = $"{urlRoadFoot}&start={station1.lon.ToString(CultureInfo.InvariantCulture)},{station1.lat.ToString(CultureInfo.InvariantCulture)}&end={station2.lon.ToString(CultureInfo.InvariantCulture)},{station2.lat.ToString(CultureInfo.InvariantCulture)}";
            var response = await client.GetStringAsync(url);
            RouteResponse road = JsonSerializer.Deserialize<RouteResponse>(response);
            Trace.WriteLine(road.ToString());

            // Parse response and extract route instructions (simplified for brevity)
            return road; // Example response
        }

        private (double lat, double lon) ParseCoordinates(string coords)
        {
            var cleanCoords = coords.Trim('[', ']').Split(',');
            return (double.Parse(cleanCoords[1]), double.Parse(cleanCoords[0]));
        }
    }

    public class Contract
    {
        public string name { get; set; }
        public string commercial_name { get; set; }
        public string country_code { get; set; }
        public List<string> cities { get; set; }
        public String ToString()
        {
            return "Name: " + name + ", commercialName: " + commercial_name + ", CountryCode: " + country_code + ", Cities: " + cities;
        }
    }

    public class Station
    {
        public int number { get; set; }
        public string contractName { get; set; }
        public string name { get; set; }
        public string address { get; set; }
        public Position position { get; set; }
        public bool banking { get; set; }
        public bool bonus { get; set; }
        public string status { get; set; }
        public DateTime lastUpdate { get; set; }
        public bool connected { get; set; }
        public bool overflow { get; set; }
        public object shape { get; set; } // Assumed to be null or object
        public TotalStands totalStands { get; set; }
        public MainStands mainStands { get; set; }
        public object overflowStands { get; set; } // Assumed to be null or object
        public String ToString()
        {
            return "Number: " + number + ", ContractName: " + contractName + ", Name: " + name + ", Address: " + address + ", Position: " + position + ", Banking: " + banking + ", Bonus: " + bonus + ", Status: " + status + ", LastUpdate: " + lastUpdate + ", Connected: " + connected + ", Overflow: " + overflow + ", Shape: " + shape + ", TotalStands: " + totalStands + ", MainStands: " + mainStands + ", OverflowStands: " + overflowStands;
        }
    }

    public class Position
    {
        public double latitude { get; set; }
        public double longitude { get; set; }

        public String ToString()
        {
            return "Latitude: " + latitude + ", Longitude: " + longitude;
        }
    }

    public class TotalStands
    {
        public Availabilities availabilities { get; set; }
        public int capacity { get; set; }
        public String ToString()
        {
            return "Availabilities: " + availabilities + ", Capacity: " + capacity;
        }
    }

    public class MainStands
    {
        public Availabilities availabilities { get; set; }
        public int capacity { get; set; }
        public String ToString()
        {
            return "Availabilities: " + availabilities + ", Capacity: " + capacity;
        }
    }

    public class Availabilities
    {
        public int bikes { get; set; }
        public int stands { get; set; }
        public int mechanicalBikes { get; set; }
        public int electricalBikes { get; set; }
        public int electricalInternalBatteryBikes { get; set; }
        public int electricalRemovableBatteryBikes { get; set; }
        public String ToString()
        {
            return "Bikes: " + bikes + ", Stands: " + stands + ", MechanicalBikes: " + mechanicalBikes + ", ElectricalBikes: " + electricalBikes + ", ElectricalInternalBatteryBikes: " + electricalInternalBatteryBikes + ", ElectricalRemovableBatteryBikes: " + electricalRemovableBatteryBikes;
        }
    }

    public class GeoFeatureCollection
    {
        public string type { get; set; }
        public string version { get; set; }
        public List<GeoFeature> features { get; set; }
        public string attribution { get; set; }
        public string licence { get; set; }
        public string query { get; set; }
        public int limit { get; set; }
        public String ToString()
        {
            return "Type: " + type + ", Version: " + version + ", Features: " + features[0].ToString() + ", Attribution: " + attribution + ", Licence: " + licence + ", Query: " + query + ", Limit: " + limit;
        }
    }

    public class GeoFeature
    {
        public string type { get; set; }
        public Geometry geometry { get; set; }
        public Properties properties { get; set; }
        public String ToString()
        {
            return "Type: " + type + ", Geometry: " + geometry.ToString() + ", Properties: " + properties.ToString();
        }
    }

    public class Geometry
    {
        public string type { get; set; }
        public List<double> coordinates { get; set; }
        public String ToString()
        {
            return "Type: " + type + ", Coordinates: " + coordinates.ToString();
        }
    }

    public class Properties
    {
        public string label { get; set; }
        public double score { get; set; }
        public string id { get; set; }
        public string banId { get; set; }
        public string type { get; set; }
        public string name { get; set; }
        public string postcode { get; set; }
        public string citycode { get; set; }
        public double x { get; set; }
        public double y { get; set; }
        public int population { get; set; }
        public string city { get; set; }
        public string context { get; set; }
        public double importance { get; set; }
        public string municipality { get; set; }
        public String ToString()
        {
            return "Label: " + label + ", Score: " + score + ", Id: " + id + ", BanId: " + banId + ", Type: " + type + ", Name: " + name + ", Postcode: " + postcode + ", Citycode: " + citycode + ", X: " + x + ", Y: " + y + ", Population: " + population + ", City: " + city + ", Context: " + context + ", Importance: " + importance + ", Municipality: " + municipality;
        }
    }


    public class RouteResponse
    {
        public string type { get; set; }
        public List<double> bbox { get; set; }
        public List<Feature> features { get; set; }
        public Metadata metadata { get; set; }

        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.AppendLine($"Type: {type}");
            sb.AppendLine($"Bbox: {string.Join(", ", bbox)}");
            sb.AppendLine($"Features: " + features.ToString());
            sb.AppendLine($"Metadata: {metadata}");
            return sb.ToString();
        }
    }

    public class Feature
    {
        public string type { get; set; }
        public List<double> bbox { get; set; }
        public PropertiesPoints properties { get; set; }
        public GeometryPoints geometry { get; set; }

        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.AppendLine($"Feature Type: {type}");
            sb.AppendLine($"Bbox: {string.Join(", ", bbox)}");
            sb.AppendLine($"Properties: {properties}");
            sb.AppendLine($"Geometry: {geometry}");
            return sb.ToString();
        }
    }

    public class PropertiesPoints
    {
        public List<Segment> segments { get; set; }
        public List<int> way_points { get; set; }
        public Summary summary { get; set; }

        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.AppendLine($"Segments: {segments?.Count ?? 0} segments");
            sb.AppendLine($"Way Points: {string.Join(", ", way_points)}");
            sb.AppendLine($"Summary: {summary}");
            return sb.ToString();
        }
    }

    public class Segment
    {
        public double distance { get; set; }
        public double duration { get; set; }
        public List<Step> steps { get; set; }

        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.AppendLine($"Distance: {distance}, Duration: {duration}");
            sb.AppendLine($"Steps: {steps?.Count ?? 0} steps");
            return sb.ToString();
        }
    }

    public class Step
    {
        public double distance { get; set; }
        public double duration { get; set; }
        public int type { get; set; }
        public string instruction { get; set; }
        public string name { get; set; }
        public List<int> way_points { get; set; }

        public override string ToString()
        {
            return $"Step: {instruction}, Distance: {distance}, Duration: {duration}, Type: {type}, Name: {name}";
        }
    }

    public class Summary
    {
        public double distance { get; set; }
        public double duration { get; set; }

        public override string ToString()
        {
            return $"Summary: Distance: {distance}, Duration: {duration}";
        }
    }

    public class GeometryPoints
    {
        public string type { get; set; }
        public List<List<double>> coordinates { get; set; }

        public override string ToString()
        {
            return $"Geometry Type: {type}, Coordinates: {coordinates?.Count ?? 0} points";
        }
    }

    public class Metadata
    {
        public string attribution { get; set; }
        public string service { get; set; }
        public long timestamp { get; set; }
        public Query query { get; set; }
        public Engine engine { get; set; }

        public override string ToString()
        {
            return $"Metadata: Attribution: {attribution}, Service: {service}, Timestamp: {timestamp}, Query: {query}, Engine: {engine}";
        }
    }

    public class Query
    {
        public List<List<double>> coordinates { get; set; }
        public string profile { get; set; }
        public string format { get; set; }

        public override string ToString()
        {
            return $"Query: Profile: {profile}, Format: {format}, Coordinates: {coordinates?.Count ?? 0} sets";
        }
    }

    public class Engine
    {
        public string version { get; set; }
        public string build_date { get; set; }
        public string graph_date { get; set; }

        public override string ToString()
        {
            return $"Engine: Version: {version}, Build Date: {build_date}, Graph Date: {graph_date}";
        }
    }

    public class Response
    {
        public List<Feature> properties { get; set; }

    }
}
