import type { AnyMessageContent, Contact, MiscMessageGenerationOptions, WAMessage, WAPresence, WASocket, proto } from "baileys";
import { Manager } from "./Manager.js";
import type { Flow } from "./Flow.js";
import {Memo} from "./Memo.js";

export enum Kind {
    SECONDS,
    MINUTES
}

export class Context {
    protected MessageContext: WAMessage;
    protected AppContext: WASocket;
    protected FlowContext: Flow;

    public phoneNumber: string;
    public body: string;
    public SenderInfo: proto.Message.IContactMessage;

    public sendOtherContact: (jid: string, content: AnyMessageContent, options?: MiscMessageGenerationOptions | undefined) => Promise<proto.WebMessageInfo | undefined>;
    public useMemo = Memo.getInstance().useMemo;
    public MemoText = Memo.getInstance().useMemoText;
    public moveToStep: (jid: string, step: number) => void;

    constructor(messageContext: WAMessage, socket: WASocket, flowContext: Flow) {
        if (!socket)
            throw 'You could not use this class if the socket is not loaded!'
        // @ts-ignore
        this.AppContext = socket;
        this.MessageContext = messageContext;
        this.sendOtherContact = this.AppContext.sendMessage.bind(this.AppContext);
        this.phoneNumber = messageContext.key.remoteJid!;
        this.body = messageContext.message?.extendedTextMessage?.text! || messageContext.message?.conversation!;
        this.SenderInfo = this.MessageContext.message?.contactMessage!;
        this.FlowContext = flowContext;
        this.moveToStep = Manager.getInstance().moveToStep;
    }

    moveToFlow = (flow: Flow) => {
        Manager.getInstance().sendToFlow(flow, this.MessageContext.key.remoteJid!);
    }

    delay(time: number, kind?: Kind): Promise<void> {
        return new Promise((res, rej) => {
            setTimeout(e => res(e), (() => {
                if (!kind)
                    return time * 1000;
                if (kind == Kind.MINUTES)
                    return time * 60 * 1000;
                if (kind == Kind.SECONDS)
                    return time * 1000;
            })());
        })
    }

    delayWithPresence = async (presence: WAPresence = 'composing', time: number, kind?: Kind) => {
        await this.AppContext.sendPresenceUpdate(presence, this.MessageContext.key.remoteJid!)
        await this.delay(time, kind);
        await this.AppContext.sendPresenceUpdate('available', this.MessageContext.key.remoteJid!);
    }

    setPresence = async (presence: WAPresence = "composing") => {
        await this.AppContext.sendPresenceUpdate(presence, this.MessageContext.key.remoteJid!);
    }
    send = (message: string | AnyMessageContent) => {
        if (typeof message === "string")
            return this.AppContext.sendMessage(this.MessageContext.key.remoteJid!, { text: message });
        else return this.AppContext.sendMessage(this.MessageContext.key.remoteJid!, { ...message });
    }
    reply = (message: string | AnyMessageContent): Promise<proto.WebMessageInfo | undefined> => {
        if (typeof message === "string")
            return this.AppContext.sendMessage(this.MessageContext.key.remoteJid!, { text: message }, {quoted: this.MessageContext});
        else return this.AppContext.sendMessage(this.MessageContext.key.remoteJid!, { ...message }, {quoted: this.MessageContext});
    }
}