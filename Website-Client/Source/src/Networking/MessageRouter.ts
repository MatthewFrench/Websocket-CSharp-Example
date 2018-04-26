//import {NetworkController} from "./NetworkController";

//const {MessageReader} = require("../Utility/Message/MessageReader.js");
//const {Controllers} = require("./MessageDefinitions/ClientMessageDefinitions.js");
//const {AccountMessageHandler} = require("./Account/AccountMessageHandler.js");
//const {GameMessageHandler} = require("./Game/GameMessageHandler.js");
//const {ChatMessageHandler} = require("./Chat/ChatMessageHandler.js");



import {NetworkController} from "./NetworkController";

/**
 * Routes the messages to controllers.
 */
export class MessageRouter {
    networkController : NetworkController;
    constructor(networkController : NetworkController) {
        this.networkController = networkController;
    }
    handleMessageEvent(binary : any) {
        let message = new MessageReader(binary);
        //Get the controller
        let controllerID = message.getUint8();
        //Send it to the correct callbacks
        switch(controllerID) {
            case Controllers.Chat.ID: {
                ChatMessageHandler.RouteMessage(message);
            } break;
            case Controllers.Network.ID: {
                MessageRouter.HandleNetworkMessages(message);
                break;
            }
            case Controllers.Network.Messages.CombinedMessage: {
                while (message.hasBinary()) {
                    try {
                        MessageRouter.HandleMessage(message.getBinary());
                    } catch (e) {
                        console.log(e);
                        console.error('Badly written combined message.');
                        console.trace();
                    }
                }
                if (!message.isAtEndOfData()) {
                    console.error('Invalid Message');
                    console.trace();
                }
            } break;
            default: {
                console.error('Unknown Message');
                console.trace();
            }
        }
    }
}