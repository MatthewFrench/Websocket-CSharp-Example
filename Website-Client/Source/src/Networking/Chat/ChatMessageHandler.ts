import {MessageReader} from "../../Utility/Message/MessageReader";
import {Controllers} from "../MessageDefinitions/ClientMessageDefinitions";

export class ChatMessageHandler {
    addChatMessageListeners : any = [];

    routeMessage(message : MessageReader) {
        let messageID = message.getUint8();
        switch(messageID) {
            case Controllers.Chat.Messages.AddChatMessage: {
                this.addChatMessage(message);
            } break;
        }
    }

    addChatMessage(message : MessageReader) {
        //Parse message with validation
        if (!message.hasUint32()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let boardID = message.getUint32();
        if (!message.hasUint32()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let playerID = message.getUint32();
        if (!message.hasString()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let chatPrefix = message.getString();
        if (!message.hasString()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let chatMessage = message.getString();
        if (!message.hasDouble()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }
        let time = message.getDouble();
        if (!message.isAtEndOfData()) {
            console.error('Invalid Message');
            console.trace();
            return;
        }

        //Send to all listeners
        for (let callback of this.addChatMessageListeners) {
            callback(boardID, playerID, chatPrefix, chatMessage, time).then();
        }
    }

    addChatMessageListener(callback : any) {
        this.addChatMessageListeners.push(callback);
    }
}