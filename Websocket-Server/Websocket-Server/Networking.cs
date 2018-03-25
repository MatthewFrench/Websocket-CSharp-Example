using System;
using WebSocketSharp;
using WebSocketSharp.Server;
namespace WebsocketServer
{
	public class Networking
	{
		WebSocketServer websocketServer;
		public Networking() {
			websocketServer = new WebSocketServer(7779);
            //SSL certificate
            //wssv.SslConfiguration.ServerCertificate = 
            //  new X509Certificate2("/path/to/cert.pfx", "password for cert.pfx");
			websocketServer.AddWebSocketService<NetworkingClient>("/Networking", (NetworkingClient client) => {
				//Set client variables here, like reference to application instance
			});
		}
		public void Start() {
			websocketServer.Start();
		}
		public void Stop() {
			websocketServer.Stop();
		}
	}
}
