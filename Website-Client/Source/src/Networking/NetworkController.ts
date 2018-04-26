//const {MessageReader} = require("../Utility/Message/MessageReader.js");
//const {MessageWriter} = require("../Utility/Message/MessageWriter.js");
//const {MessageRouter} = require("./MessageRouter.js");

import {AppController} from "../AppController";

export class NetworkController {
    port : any = '7779';
    ip : any = 'localhost';
    server : any = `http://${this.ip}:${this.port}`;
    connection : any = null;
    connected : any = false;
    pingTime : any = 0;
    pingTimeArray : any = [];
    appController : AppController;

    constructor(appController : AppController) {
        this.appController = appController;
        var test = new WebsocketClient();

        this.connection = this.socketIO.connect(this.server);
        this.connection.on('connect_failed', this.ConnectFailed);
        this.connection.on('connect', this.Connected);
        this.connection.on('message', this.GotMessage);
        this.connection.on('disconnect', this.Disconnected);

        this.connection.on('pong', function(ms : any) {
            this.pingTime = ms;
            this.pingTimeArray.push(this.pingTime);
            if (this.pingTimeArray.length > 3) {
                this.pingTimeArray.shift();
            }
        });
    }

    connectFailedEvent() {
        NetworkHandler.HandleConnectFailed();
        console.log('Failed to connect to server.');
    }

    connectedEvent() {
        this.connected = true;
        NetworkHandler.HandleConnect();
        console.log('Client has connected to the server!');
    }

    disconnectedEvent() {
        this.connected = false;
        NetworkHandler.HandleDisconnect();
        console.log('The client has disconnected!');
    }

    getIsConnected() {
        return this.connected;
    }

    getPing() {
        if (this.pingTimeArray.length === 0) {
            return this.pingTime;
        }
        let average = 0;
        for (let ping of this.pingTimeArray) {
            average += ping;
        }
        average = average / this.pingTimeArray.length;
        return (this.pingTime + average) / 2.0;
    }

    gotMessageEvent(message : any) {
        if (message instanceof ArrayBuffer === false) {
            console.error('Invalid Message Type Not Binary');
            console.trace();
            return;
        }
        NetworkHandler.HandleMessage(message);
    }

    Send(message : any) {
        this.connection.send(message);
    }
}