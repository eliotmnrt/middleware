using CacheProxy;
using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Description;
using System.Text;
using System.Threading.Tasks;
using static System.Collections.Specialized.BitVector32;

namespace ProxyCache
{
    internal class Program
    {
        static void Main(string[] args)
        {
            //Create a URI to serve as the base address
            //Be careful to run Visual Studio as Admistrator or to allow VS to open new port netsh command. 
            // Example : netsh http add urlacl url=http://+:80/MyUri user=DOMAIN\user
            Uri contractUrl = new Uri("http://localhost:8034/Contrats");
            Uri stationUrl = new Uri("http://localhost:8035/Stations");
            Uri coordUrl = new Uri("http://localhost:8036/Coord");
            Uri routeUrl = new Uri("http://localhost:8037/Route");

            //Create ServiceHost
            ServiceHost contractHost = new ServiceHost(typeof(GenericProxyCache<List<Contract>>), contractUrl);
            contractHost.AddServiceEndpoint(typeof(IGenericProxyCache<List<Contract>>), new WSHttpBinding(), "");

            ServiceHost stationHost = new ServiceHost(typeof(GenericProxyCache<List<Station>>), stationUrl);
            stationHost.AddServiceEndpoint(typeof(IGenericProxyCache<List<Station>>), new WSHttpBinding(), "");

            ServiceHost coordHost = new ServiceHost(typeof(GenericProxyCache<GeoFeatureCollection>), coordUrl);
            coordHost.AddServiceEndpoint(typeof(IGenericProxyCache<GeoFeatureCollection>), new WSHttpBinding(), "");

            ServiceHost routeHost = new ServiceHost(typeof(GenericProxyCache<RouteResponse>), routeUrl);
            routeHost.AddServiceEndpoint(typeof(IGenericProxyCache<RouteResponse>), new WSHttpBinding(), "");



            // Multiple end points can be added to the Service using AddServiceEndpoint() method.
            // Host.Open() will run the service, so that it can be used by any client.

            // Example adding :
            // Uri tcpUrl = new Uri("net.tcp://localhost:8090/MyService/SimpleCalculator");
            // ServiceHost host = new ServiceHost(typeof(MyCalculatorService.SimpleCalculator), httpUrl, tcpUrl);

            //Add a service endpoint

            //Enable metadata exchange
            ServiceMetadataBehavior smb = new ServiceMetadataBehavior();
            smb.HttpGetEnabled = true;
            contractHost.Description.Behaviors.Add(smb);
            stationHost.Description.Behaviors.Add(smb);
            coordHost.Description.Behaviors.Add(smb);
            routeHost.Description.Behaviors.Add(smb);

            //Start the Service
            try
            {
                contractHost.Open();
                Console.WriteLine("ContractHost started successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ContractHost failed to start: {ex.Message}");
            }

            try
            {
                stationHost.Open();
                Console.WriteLine("StationHost started successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"StationHost failed to start: {ex.Message}");
            }
            try
            {
                coordHost.Open();
                Console.WriteLine("CoordsHost started successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"CoordsHost failed to start: {ex.Message}");
            }

            try
            {
                routeHost.Open();
                Console.WriteLine("routeHost started successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"routeHost failed to start: {ex.Message}");
            }


            Console.WriteLine("Service is host at " + DateTime.Now.ToString());
            Console.WriteLine("Host is running... Press <Enter> key to stop");
            Console.ReadLine();
        }
    }
}