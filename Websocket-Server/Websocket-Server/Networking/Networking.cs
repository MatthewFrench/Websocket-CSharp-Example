using System;
using Fleck;
using System.Collections.Generic;
using System.Text;
namespace WebsocketServer
{
	public class Networking
	{
		int port = 7779;
		WebSocketServer websocketServer;
		ServerController serverController;
		List<IWebSocketConnection> webSockets = new List<IWebSocketConnection>();
		public Networking(ServerController controller) {
			serverController = controller;
		}
        
		public void ClientConnectedEvent(IWebSocketConnection socket) {
			webSockets.Add(socket);
			Console.WriteLine("Open!");
			Console.WriteLine("Clients connected: " + GetNumberOfConnectedClients());
		}
        
        public void ClientDisconnectedEvent(IWebSocketConnection socket)
        {
			webSockets.Remove(socket);
            Console.WriteLine("Close!");
        }

		public void ClientMessageEvent(IWebSocketConnection socket, byte[] binary) {
			var sb = new StringBuilder();
			foreach (var b in binary)
            {
				if (sb.Length > 0) {
					sb.Append(", ");
				}
                sb.Append(b);
            }

			Console.WriteLine("Got Message! : new byte[] { " + sb.ToString() + " } = " + Encoding.UTF8.GetString(binary));
		}


        public void Start()
        {
			websocketServer = new WebSocketServer("ws://127.0.0.1:" + port);
            websocketServer.Start(socket =>
            {
                socket.OnOpen = () => { ClientConnectedEvent(socket); };
                socket.OnClose = () => { ClientDisconnectedEvent(socket); };
                socket.OnBinary = (byte[] binary) => { ClientMessageEvent(socket, binary); };
                socket.OnError = (Exception error) => { Console.WriteLine("Client Error: " + error); };
            });
        }

		public void Stop() {
			foreach (var socket in webSockets) {
				socket.Close();
			}
            webSockets.Clear();
			websocketServer.ListenerSocket.Close();
			websocketServer.Dispose();
		}

		public int GetNumberOfConnectedClients() {
			return webSockets.Count;
		}
	}
}