using System;
using WebSocketSharp;
using WebSocketSharp.Server;
namespace WebsocketServer
{
    public class MyApplication
    {
        public MyApplication()
        {
			Console.WriteLine("Hello World!");

            var networking = new Networking();
            networking.Start();
            Console.ReadKey(true);
            networking.Stop();
        }
    }
}
