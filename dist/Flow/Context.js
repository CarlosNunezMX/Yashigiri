import { Manager } from "./Manager.js";
import { Memo } from "./Memo.js";
export var Kind;
(function (Kind) {
    Kind[Kind["SECONDS"] = 0] = "SECONDS";
    Kind[Kind["MINUTES"] = 1] = "MINUTES";
})(Kind || (Kind = {}));
export class Context {
    MessageContext;
    AppContext;
    FlowContext;
    phoneNumber;
    body;
    SenderInfo;
    sendOtherContact;
    useMemo = Memo.getInstance().useMemo;
    MemoText = Memo.getInstance().useMemoText;
    moveToStep;
    constructor(messageContext, socket, flowContext) {
        if (!socket)
            throw 'You could not use this class if the socket is not loaded!';
        // @ts-ignore
        this.AppContext = socket;
        this.MessageContext = messageContext;
        this.sendOtherContact = this.AppContext.sendMessage.bind(this.AppContext);
        this.phoneNumber = messageContext.key.remoteJid;
        this.body = messageContext.message?.extendedTextMessage?.text || messageContext.message?.conversation;
        this.SenderInfo = this.MessageContext.message?.contactMessage;
        this.FlowContext = flowContext;
        this.moveToStep = Manager.getInstance().moveToStep;
    }
    moveToFlow = (flow) => {
        Manager.getInstance().sendToFlow(flow, this.MessageContext.key.remoteJid);
    };
    delay(time, kind) {
        return new Promise((res, rej) => {
            setTimeout(e => res(e), (() => {
                if (!kind)
                    return time * 1000;
                if (kind == Kind.MINUTES)
                    return time * 60 * 1000;
                if (kind == Kind.SECONDS)
                    return time * 1000;
            })());
        });
    }
    delayWithPresence = async (presence = 'composing', time, kind) => {
        await this.AppContext.sendPresenceUpdate(presence, this.MessageContext.key.remoteJid);
        await this.delay(time, kind);
        await this.AppContext.sendPresenceUpdate('available', this.MessageContext.key.remoteJid);
    };
    setPresence = async (presence = "composing") => {
        await this.AppContext.sendPresenceUpdate(presence, this.MessageContext.key.remoteJid);
    };
    send = (message) => {
        if (typeof message === "string")
            return this.AppContext.sendMessage(this.MessageContext.key.remoteJid, { text: message });
        else
            return this.AppContext.sendMessage(this.MessageContext.key.remoteJid, { ...message });
    };
    reply = (message) => {
        if (typeof message === "string")
            return this.AppContext.sendMessage(this.MessageContext.key.remoteJid, { text: message }, { quoted: this.MessageContext });
        else
            return this.AppContext.sendMessage(this.MessageContext.key.remoteJid, { ...message }, { quoted: this.MessageContext });
    };
}
