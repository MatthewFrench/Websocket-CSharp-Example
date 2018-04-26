using System;
using WebSocketSharp;
using WebSocketSharp.Server;
namespace WebsocketServer
{
    public class ServerController
    {
        public ServerController()
        {
			Console.WriteLine("Hello World!");

            var networking = new Networking(this);
            networking.Start();
            Console.ReadKey(true);
            networking.Stop();
        }
    }
}
