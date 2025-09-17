import type { proto } from "baileys";

export namespace MessageTools {
    export function toString(message: proto.Message.IExtendedTextMessage | string) {
        if (typeof message === "object")
            return message.text!;
        return message;
    }

    export function selectMessage(message: proto.IMessage) {
        return message.documentMessage || message.extendedTextMessage || message.conversation;
    }
}