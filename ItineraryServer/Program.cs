﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel.Description;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Threading.Tasks;

namespace ItineraryServer
{
    internal class Program
    {
        static void Main(string[] args)
        {
            //Create a URI to serve as the base address
            //Be careful to run Visual Studio as Admistrator or to allow VS to open new port netsh command. 
            // Example : netsh http add urlacl url=http://+:80/MyUri user=DOMAIN\user
            Uri httpUrl = new Uri("http://localhost:8081/Itinerary");
            Uri httpUrlSoap = new Uri("http://localhost:8081/ItinerarySoap");

            //Create ServiceHost
            ServiceHost host = new ServiceHost(typeof(StationService), httpUrl);
            ServiceHost hostSoap = new ServiceHost(typeof(StationService), httpUrlSoap);

            // Multiple end points can be added to the Service using AddServiceEndpoint() method.
            // Host.Open() will run the service, so that it can be used by any client.

            // Example adding :
            // Uri tcpUrl = new Uri("net.tcp://localhost:8090/MyService/SimpleCalculator");
            // ServiceHost host = new ServiceHost(typeof(MyCalculatorService.SimpleCalculator), httpUrl, tcpUrl);

            //Add a service endpoint
            WebHttpBinding binding = new WebHttpBinding
            {
                MaxReceivedMessageSize = 10 * 1024 * 1024, // 10 MB
            };

            ServiceEndpoint endpoint = host.AddServiceEndpoint(typeof(IStationService), binding, "");
            endpoint.EndpointBehaviors.Add(new WebHttpBehavior());

            ServiceEndpoint endpointSoap = hostSoap.AddServiceEndpoint(typeof(IStationServiceSoap), new BasicHttpBinding(), "");

            //Enable metadata exchange
            ServiceMetadataBehavior smb = new ServiceMetadataBehavior();
            smb.HttpGetEnabled = true;
            host.Description.Behaviors.Add(smb);
            hostSoap.Description.Behaviors.Add(smb);

            //Start the Service
            host.Open();
            hostSoap.Open();
            

            Console.WriteLine("Service is host at " + DateTime.Now.ToString());
            Console.WriteLine("Host is running... Press <Enter> key to stop");
            Console.ReadLine();

        }
    }
}
