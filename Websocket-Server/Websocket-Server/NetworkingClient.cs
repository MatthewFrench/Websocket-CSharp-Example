using System;
using WebSocketSharp;
using WebSocketSharp.Server;
namespace WebsocketServer
{
    public class NetworkingClient : WebSocketBehavior
    {
        protected override void OnOpen()
        {
            Console.WriteLine("On Open");
        }
        protected override void OnError(ErrorEventArgs e)
        {
            Console.WriteLine("On Error");
        }
        protected override void OnClose(CloseEventArgs e)
        {
            Console.WriteLine("On Close");
        }
        protected override void OnMessage(MessageEventArgs e)
        {
            var msg = e.Data == "BALUS"
                      ? "I've been balused already..."
                      : "I'm not available now.";

            Send(msg);


            Console.WriteLine("On Message: " + e.Data);
        }
    }
}
