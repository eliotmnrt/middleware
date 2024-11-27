using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Runtime.Caching;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;


namespace CacheProxy
{

    public class GenericProxyCache<T> : IGenericProxyCache<T>
    {
        private readonly ObjectCache _cache = MemoryCache.Default;
        public DateTimeOffset DtDefault { get; set; } = ObjectCache.InfiniteAbsoluteExpiration;

        // Get with default expiration
        public Task<T> Get(string cacheItemName)
        {
            return GetWithDateTimeOffset(cacheItemName, DtDefault);
        }

        // Get with expiration in seconds
        public Task<T> GetWithExpiration(string cacheItemName, double dtSeconds)
        {
            return GetWithDateTimeOffset(cacheItemName, DateTimeOffset.Now.AddSeconds(dtSeconds));
        }

        // Get with a specific expiration time
        public async Task<T> GetWithDateTimeOffset(string cacheItemName, DateTimeOffset dt)
        {
            if (!_cache.Contains(cacheItemName))
            {
                Console.WriteLine(cacheItemName);
                var client = new HttpClient();
                var response = await client.GetStringAsync(cacheItemName);
                T newItem = JsonSerializer.Deserialize<T>(response);
                _cache.Set(cacheItemName, newItem, dt);
                return newItem;
            }
            Console.WriteLine("LE CASSSSSSSSSSSSSSSHHHHHHHHHHHHHHHHHHHHHHHHHH a été utilisé pour l'élement" + cacheItemName);
            return (T)_cache.Get(cacheItemName);
        }
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
    public Properties1 properties { get; set; }
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

public class Properties1
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