import type { AnyMessageContent, proto, WAMessage, WAPresence, WASocket } from "baileys";
import type IContextAdapter from "../../classes/IContextAdapter";

export class BaileysContextAdapter implements IContextAdapter {
    constructor(
        public messageBody: WAMessage,
        public sendMessageBody: AnyMessageContent,
        public meta: proto.IMessageKey,
        public sentMessage: proto.WebMessageInfo,
        public presence: WAPresence
    ) { }
}

