//const {MessageReader} = require("../Utility/Message/MessageReader.js");
//const {MessageWriter} = require("../Utility/Message/MessageWriter.js");
//const {NetworkHandler} = require("./NetworkHandler.js");

export class Network {
    static port : any = '7779';
    static ip : any = 'localhost';
    //let ip = '18.221.216.221';
    static server : any = `http://${Network.ip}:${Network.port}`;
    static connection : any = null;
    static connected : any = false;
    static pingTime : any = 0;
    static pingTimeArray : any = [];

    static Initialize() {
        var test = new WebsocketClient();

        Network.connection = Network.socketIO.connect(Network.server);
        Network.connection.on('connect_failed', Network.ConnectFailed);
        Network.connection.on('connect', Network.Connected);
        Network.connection.on('message', Network.GotMessage);
        Network.connection.on('disconnect', Network.Disconnected);

        Network.connection.on('pong', function(ms : any) {
            Network.pingTime = ms;
            Network.pingTimeArray.push(Network.pingTime);
            if (Network.pingTimeArray.length > 3) {
                Network.pingTimeArray.shift();
            }
        });
    }

    static ConnectFailed() {
        NetworkHandler.HandleConnectFailed();
        console.log('Failed to connect to server.');
    }

    static Connected() {
        Network.connected = true;
        NetworkHandler.HandleConnect();
        console.log('Client has connected to the server!');
    }

    static Disconnected() {
        Network.connected = false;
        NetworkHandler.HandleDisconnect();
        console.log('The client has disconnected!');
    }

    static IsConnected() {
        return Network.connected;
    }

    static GetPing() {
        if (Network.pingTimeArray.length === 0) {
            return Network.pingTime;
        }
        let average = 0;
        for (let ping of Network.pingTimeArray) {
            average += ping;
        }
        average = average / Network.pingTimeArray.length;
        return (Network.pingTime + average) / 2.0;
    }

    static GotMessage(message : any) {
        if (message instanceof ArrayBuffer === false) {
            console.error('Invalid Message Type Not Binary');
            console.trace();
            return;
        }
        NetworkHandler.HandleMessage(message);
    }

    static Send(message : any) {
        Network.connection.send(message);
    }
}