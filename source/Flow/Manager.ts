import type { BaileysEventMap, WASocket, AnyMessageContent, WAMessage, proto } from "@whiskeysockets/baileys";
import { Answer, Flow, type AnswerConstructor } from "./Flow.js";
import { Analyzer } from "./Analyzer.js";
import { Context } from "./Context.js";
import { BlackList, WhiteList } from "./Lists.js";

/**
 * You cant create an instance of this class, please
 * use Manager->getInstance to accesss to the class
 */

export type WAMessageEvent = (keyof proto.IWebMessageInfo);
export class Manager {
    private BlackList?: BlackList;
    private WhiteList?: WhiteList;

    private ContextReference: typeof Context = Context;

    useBlackList = (bl: BlackList) => {
        this.BlackList = bl;
        return this;
    }

    useContext(newContext: typeof Context){
        this.ContextReference = newContext;
    }

    private events: Array<string | WAMessageEvent> = [];

    private someEvent(Message: proto.IWebMessageInfo) {
        const [event] = Object.keys(Message)[0];
        return this.events.some(ev => ev === event) || !Message.key.participant;
    }
    useEventDisbler = (events: WAMessageEvent[] | WAMessageEvent | string[] | string) => {
        if (!Array.isArray(events)) {
            this.events.push(events)
            return this;
        }
        this.events = this.events.concat(events);
        return this;
    }
    useWhiteList = (wl: WhiteList) => {
        this.WhiteList = wl;
        return this;
    }

    SocketConnection: WASocket | undefined;
    private Flows: Map<string, Flow> = new Map();
    public attach = (whatsapp_context: WASocket) => {
        this.SocketConnection = whatsapp_context;
        this.SocketConnection.ev.on('messages.upsert', this.getMessage.bind(this));
    }

    private reset = (jid: string) => {
        const flow = this.Flows.get(jid);
        if (!flow)
            return false;
        if (flow.nextFlow) {
            this.Flows.set(jid, flow.nextFlow);
            return true;
        }
        if (!flow.getNext())
            return this.Flows.delete(jid)
        return false;
    }
    private Memo: Map<string, Map<string, any>> = new Map();
    private Analyzer = new Analyzer([]);
    private AreWeWaiting: boolean = false;
    addFlow = (flow: Flow | Flow[]) => {
        if (Array.isArray(flow)) {
            flow.forEach(f => this.Analyzer.addFlow(f));
            return this;
        }
        this.Analyzer.addFlow(flow);
        return this;
    }

    sendToFlow = (flow: Flow, jid: string) => {
        this.Flows.set(jid, flow);
    }

    FlowNotFountMessage: string = "";
    private getMessage = async (context: BaileysEventMap["messages.upsert"]) => {
        const cellPhone = context.messages[0].key.remoteJid!;
        const message = context.messages[0].message?.extendedTextMessage?.text! || context.messages[0].message?.conversation!;
        if (!this.someEvent(context.messages[0]))
            return;

        if ((this.BlackList && this.BlackList.get(cellPhone)))
            return;

        if ((this.WhiteList && this.WhiteList.get(cellPhone)))
            return;

        // @ts-ignore
        let flow: Flow = this.Flows.get(cellPhone);
        // if the message had sent by us, we dont make nothing
        if (!message || context.messages[0].key.fromMe)
            return;

        // if the flow wasnt fount we will create one with the analyzer class
        if (!flow) {
            const FlowFount = this.Analyzer.parse(message);
            if (!FlowFount && this.FlowNotFountMessage)
                return this.SocketConnection?.sendMessage(cellPhone, { text: this.FlowNotFountMessage });
            if (!FlowFount)
                return;

            this.Flows.set(cellPhone, FlowFount);
            console.log(`Entering in flow ${FlowFount.flowName}`);

            // @ts-ignore
            flow = this.Flows.get(cellPhone);
        }
        await this.FlowQueue(flow, context);

    }


    // TODO: implement what to do when flow gets on its end.
    private FlowQueue = async (flow: Flow, context: BaileysEventMap["messages.upsert"]): Promise<void> => {
        const CurrentAnswer = flow.getCurrentAnswer();
        const jid = context.messages[0].key.remoteJid!;

        if (typeof CurrentAnswer === "string") {
            this.SocketConnection?.sendMessage(jid, {
                text: this.useMemoText(jid, CurrentAnswer)
            });
            if (this.reset(jid))
                return;
            flow.CurrentAnswer++;
            return this.FlowQueue.bind(this)(flow, context);
        } else if ((CurrentAnswer as AnswerConstructor).prototype && (CurrentAnswer as AnswerConstructor).prototype instanceof Answer) {
            const nanswer = new (CurrentAnswer as AnswerConstructor)();
            // here is the logic to the context messages
            if (nanswer.waitForAnswer && !this.AreWeWaiting) {
                this.AreWeWaiting = true;
                return;
            }

            if (nanswer.waitForAnswer && this.AreWeWaiting) {
                const response = nanswer.handler(new this.ContextReference(
                    context.messages[0], 
                    // @ts-ignore
                    this.SocketConnection
                ));
                if (response instanceof Promise) {
                    return response.then(() => {
                        this.AreWeWaiting = false;
                        if (this.reset(jid))
                            return;
                        flow.CurrentAnswer++;
                        return this.FlowQueue.bind(this)(flow, context);
                    })
                }

                this.AreWeWaiting = false;
                flow.CurrentAnswer++;
                if (this.reset(jid))
                    return;
                return this.FlowQueue.bind(this)(flow, context);
            }

            if (!nanswer.waitForAnswer) {
                const response = nanswer.handler(new this.ContextReference(
                    context.messages[0], 
                    // @ts-ignore
                    this.SocketConnection
                ));
                if (response instanceof Promise) {
                    await response.then()
                }

                if (this.reset(jid))
                    return;
                flow.CurrentAnswer++;
                return this.FlowQueue.bind(this)(flow, context);
            }

        }

        if (typeof CurrentAnswer === "object") {
            this.SocketConnection?.sendMessage(jid, CurrentAnswer as AnyMessageContent)
            if (this.reset(jid))
                return;
            flow.CurrentAnswer++;
            return this.FlowQueue.bind(this)(flow, context);
        }

    }

    public useMemo = <MemoType>(jid: string, key: string, value?: MemoType): MemoType => {
        let _memo = this.Memo.get(jid);
        console.log(`Setting a variable ${key} for ${jid} with the value ${value}`);

        if (!_memo)
            _memo = new Map()
        const val = _memo.get(key);
        if (!val && value) {
            _memo.set(key, value);
            this.Memo.set(jid, _memo);
            return value;
        }

        return val
    }

    private static Instance: Manager | undefined;
    public static getInstance() {
        if (!this.Instance)
            this.Instance = new Manager();
        return this.Instance;
    }

    /***
    *	Message Format: 
    *		"Hola {name}, tu estado es {status}"
    *
    *	Output:
    *		"Hola Carlos Nu, tu estado es VIGENTE!"
    * ***/
    useMemoText = (jid: string, message: string): string => {
        let regex = new RegExp(/{\S+}/g);
        let StringOnlyRegex = new RegExp(/[A-z]+/g);

        let Variables = message.match(regex);
        if (!Variables)
            return message;

        let toReplaced = Variables.map(variable => ({
            token: (variable.match(StringOnlyRegex) ?? [])[0] ?? '',
            original: variable
        }))

        toReplaced.forEach(replace => {
            let Data = this.Memo.get(jid)?.get(replace.token) ?? 'Indefinido';
            message = message.replace(replace.original, Data);
        })

        return message;
    }
}