import type { WASocket, proto } from "baileys";
import { Flow } from "./Flow.js";
import { Context } from "./Context.js";
import { BlackList, WhiteList } from "./Lists.js";
import type { Database } from "./Database.js";
/**
 * You cant create an instance of this class, please
 * use Manager->getInstance to accesss to the class
 */
export type WAMessageEvent = (keyof proto.IWebMessageInfo);
export declare class Manager {
    private database?;
    private BlackList?;
    private WhiteList?;
    private delay;
    private Memo;
    private ContextReference;
    private Analyzer;
    private events;
    setDatabase(database: Database): void;
    setDelay(ms: number): void;
    useBlackList: (bl: BlackList) => this;
    useContext(newContext: typeof Context): void;
    private someEvent;
    useEventDisabler: (events: WAMessageEvent[] | WAMessageEvent | string[] | string) => this;
    useWhiteList: (wl: WhiteList) => this;
    private haveReset;
    moveToStep: (jid: string, step: number) => void;
    SocketConnection: WASocket | undefined;
    private Flows;
    attach: (whatsapp_context: WASocket) => void;
    private _delay;
    private useDelay;
    private reset;
    addFlow: (flow: Flow | Flow[]) => this;
    sendToFlow: (flow: Flow, jid: string) => void;
    FlowNotFountMessage: string;
    private getMessage;
    private FlowQueue;
    private static Instance;
    static getInstance(): Manager;
}
