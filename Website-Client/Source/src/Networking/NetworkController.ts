import {MessageRouter} from "./MessageRouter";

import {AppController} from "../AppController";
import {ChatMessageCreator} from "./Chat/ChatMessageCreator";

export class NetworkController {
    port : string = '7779';
    ip : string = 'localhost';
    serverURL : string = `ws://${this.ip}:${this.port}`;
    connection : WebSocket = null;
    connected : boolean = false;
    pingTime : number = 0;
    pingTimeArray : number[] = [];
    appController : AppController;
    messageRouter : MessageRouter;

    constructor(appController : AppController) {
        this.appController = appController;
        this.messageRouter = new MessageRouter(this);
    }

    initialize = () => {
        // Create WebSocket connection.
        this.connection = new WebSocket(this.serverURL);

        // Connection opened
        this.connection.addEventListener('open', this.connectedEvent);

        // Listen for messages
        this.connection.addEventListener('message', this.gotMessageEvent);

        // Connection closed
        this.connection.addEventListener('close', this.disconnectedEvent);

        // Connection error
        this.connection.addEventListener('error', this.errorEvent);
    };

    connectedEvent = () => {
        this.connected = true;
        console.log('Client has connected to the server!');

        this.send(ChatMessageCreator.NewChatMessage('Hello!'));
    };

    disconnectedEvent = (close : CloseEvent) => {
        if (this.connected == false) {
            //Try to reconnect at an interval
            setTimeout(this.initialize, 10 * 1000);
        } else {
            //Was just connected and now isn't, try an immediate reconnect
            this.initialize();
            this.connected = false;
            console.log('The client has disconnected!');
        }
    };

    errorEvent = (error : ErrorEvent) => {
        console.log('Connection error: ' + JSON.stringify(error));
    };

    getIsConnected = () : boolean => {
        return this.connected;
    };

    //This will be the heartbeat to detect dropped connections
    //Give a heartbeat of 10 seconds after expected ping interval
    pongEvent = (milliseconds : number) => {
        this.pingTime = milliseconds;
        this.pingTimeArray.push(this.pingTime);
        if (this.pingTimeArray.length > 3) {
            this.pingTimeArray.shift();
        }
    };

    getPing() : number {
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

    getAppController() : AppController {
        return this.appController;
    }

    gotMessageEvent = (event : MessageEvent) => {
        let message = event.data;
        if (message instanceof ArrayBuffer === false) {
            console.error('Invalid Message Type Not Binary');
            console.trace();
            return;
        }
        this.messageRouter.handleMessageEvent(message);
    };

    send(message : ArrayBuffer) {
        this.connection.send(message);
    }
}