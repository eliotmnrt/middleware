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
            Uri DataUrl = new Uri("http://localhost:8034/Data");

            //Create ServiceHost
            
            ServiceHost host = new ServiceHost(typeof(GenericProxyCache<string>), DataUrl);

            WSHttpBinding binding = new WSHttpBinding();


            host.AddServiceEndpoint(typeof(IGenericProxyCache<string>), binding, DataUrl);




            // Multiple end points can be added to the Service using AddServiceEndpoint() method.
            // Host.Open() will run the service, so that it can be used by any client.

            // Example adding :
            // Uri tcpUrl = new Uri("net.tcp://localhost:8090/MyService/SimpleCalculator");
            // ServiceHost host = new ServiceHost(typeof(MyCalculatorService.SimpleCalculator), httpUrl, tcpUrl);

            //Add a service endpoint

            //Enable metadata exchange
            ServiceMetadataBehavior smb = new ServiceMetadataBehavior();
            smb.HttpGetEnabled = true;
            host.Description.Behaviors.Add(smb);
           
            //Start the Service
            try
            {
                host.Open();
                Console.WriteLine("host started successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"host failed to start: {ex.Message}");
            }

            

            Console.WriteLine("Service is host at " + DateTime.Now.ToString());
            Console.WriteLine("Host is running... Press <Enter> key to stop");
            Console.ReadLine();
        }
    }
}