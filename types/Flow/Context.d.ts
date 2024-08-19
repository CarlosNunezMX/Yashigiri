import type { AnyMessageContent, MiscMessageGenerationOptions, WAMessage, WAPresence, WASocket, proto } from "baileys";
import type { Flow } from "./Flow.js";
export declare enum Kind {
    SECONDS = 0,
    MINUTES = 1
}
export declare class Context {
    protected MessageContext: WAMessage;
    protected AppContext: WASocket;
    protected FlowContext: Flow;
    phoneNumber: string;
    body: string;
    SenderInfo: proto.Message.IContactMessage;
    sendOtherContact: (jid: string, content: AnyMessageContent, options?: MiscMessageGenerationOptions | undefined) => Promise<proto.WebMessageInfo | undefined>;
    useMemo: <MemoType>(jid: string, key: string, value?: MemoType | undefined) => MemoType;
    MemoText: (jid: string, message: string) => string;
    moveToStep: (jid: string, step: number) => void;
    constructor(messageContext: WAMessage, socket: WASocket, flowContext: Flow);
    moveToFlow: (flow: Flow) => void;
    delay(time: number, kind?: Kind): Promise<void>;
    delayWithPresence: (presence: WAPresence | undefined, time: number, kind?: Kind) => Promise<void>;
    setPresence: (presence?: WAPresence) => Promise<void>;
    send: (message: string | AnyMessageContent) => Promise<proto.WebMessageInfo | undefined>;
    reply: (message: string | AnyMessageContent) => Promise<proto.WebMessageInfo | undefined>;
}
