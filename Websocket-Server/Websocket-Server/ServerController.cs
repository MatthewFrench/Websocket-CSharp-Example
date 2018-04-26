using System;
using System.Threading;
namespace WebsocketServer
{
    public class ServerController
    {
		Networking networking;
        public ServerController()
        {         
            networking = new Networking(this);

            networking.Start();
            Console.ReadKey(true);
            networking.Stop();
			Thread.Sleep(1000);
        }

		public Networking GetNetworking() {
			return this.networking;
		}
    }
}