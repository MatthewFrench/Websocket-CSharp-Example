using System;
using WebSocketSharp;
using WebSocketSharp.Server;
namespace WebsocketServer
{
	public class Networking
	{
		int port = 7779;
		WebSocketServer websocketServer;
		ServerController serverController;
		public Networking(ServerController controller) {
			serverController = controller;
			websocketServer = new WebSocketServer(port);
            //SSL certificate
            //wssv.SslConfiguration.ServerCertificate = 
            //  new X509Certificate2("/path/to/cert.pfx", "password for cert.pfx");
			websocketServer.AddWebSocketService<NetworkingClient>("/", (NetworkingClient client) => {
				//Set client variables here, like reference to application instance
				client.setServerController(serverController);
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
