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
    private delay: number = 1000;

    setDelay(ms: number){
        this.delay = ms;
    }

    
    private ContextReference: typeof Context = Context;
    
    useBlackList = (bl: BlackList) => {
        this.BlackList = bl;
        return this;
    }
    
    useContext(newContext: typeof Context) {
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
    
    private haveReset = (jid: string, context: BaileysEventMap["messages.upsert"]) => {
        const flow = this.Flows.get(jid)!;
        const haveNext = flow.getNext();
        
        if(!haveNext){
            if(!flow.nextFlow)  
            return this.Flows.delete(jid);
        this.Flows.set(jid, flow.nextFlow.copy());
        return this.FlowQueue(context);
    }
    
    flow.CurrentAnswer++;
        this.FlowQueue(context);
        
    }
    moveToStep = (jid: string, step: number) => {
        const flow = this.Flows.get(jid)!
        flow.skipToStep(step);
        this.Flows.set(jid, flow);
    }
    SocketConnection: WASocket | undefined;
    private Flows: Map<string, Flow> = new Map();
    public attach = (whatsapp_context: WASocket) => {
        this.SocketConnection = whatsapp_context;
        this.SocketConnection.ev.on('messages.upsert', this.getMessage.bind(this));
    }
    private async _delay(ms: number): Promise<void>{
        return new Promise((res, rej) => {
            setTimeout(() => res(), ms);
        })
    }
    private async useDelay(jid: string){
        await this.SocketConnection?.sendPresenceUpdate("composing", jid);
        await this._delay(this.delay);
        await this.SocketConnection?.sendPresenceUpdate('available', jid)
    }
    private reset = (jid: string) => {
        const flow = this.Flows.get(jid);
        console.log("Check if reset...");
        
        if (!flow)
        return false;
    
    if (!flow.getNext()) {
        console.log("Going to next flow");
        
        if (flow.nextFlow) {
            flow.nextFlow.CurrentAnswer = -1;
            return this.Flows.set(jid, flow.nextFlow);
        }
        this.Flows.delete(jid)
        return false;
    }
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
        await this.FlowQueue(context);

    }


    // TODO: implement what to do when flow gets on its end.
    private FlowQueue = async (context: BaileysEventMap["messages.upsert"]): Promise<void> => {
        const jid = context.messages[0].key.remoteJid!;
        const flow = this.Flows.get(jid)!;
        const CurrentAnswer = flow.getCurrentAnswer();

        if (typeof CurrentAnswer === "string") {
            console.log('Answer is of string type.');
            await this.useDelay(jid)
            this.SocketConnection?.sendMessage(jid, {
                text: this.useMemoText(jid, CurrentAnswer)
            });
            this.haveReset(jid, context);
        } else if ((CurrentAnswer as AnswerConstructor).prototype && (CurrentAnswer as AnswerConstructor).prototype instanceof Answer) {
            console.log("Answer is AnswerAPI like");
            
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
                    this.SocketConnection,

                    flow
                ));
                if (response instanceof Promise) {
                    return response.then(() => {
                        this.AreWeWaiting = false;
                        this.haveReset(jid, context);
                    })
                }

                this.AreWeWaiting = false;
                this.haveReset(jid, context);
            }

            if (!nanswer.waitForAnswer) {
                const response = nanswer.handler(new this.ContextReference(
                    context.messages[0],
                    // @ts-ignore
                    this.SocketConnection,

                    flow
                ));
                if (response instanceof Promise) {
                    await response.then()
                }

                this.haveReset(jid, context);
            }

        }

        if (typeof CurrentAnswer === "object") {
            console.log("Answer is Baileys-Like");
            await this.useDelay(jid)
            this.SocketConnection?.sendMessage(jid, CurrentAnswer as AnyMessageContent)
            this.haveReset(jid, context);
        }

    }

    public useMemo = <MemoType>(jid: string, key: string, value?: MemoType): MemoType => {
        let _memo = this.Memo.get(jid);
        console.log(`Setting a variable ${key} for ${jid} with the value ${value}`);

        if (!_memo)
            _memo = new Map()
        const val = _memo.get(key);
        if (value) {
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

        const memoJin = this.Memo.get(jid);
        toReplaced.forEach(replace => {
            let Data = memoJin?.get(replace.token) ?? 'Indefinido';
            message = message.replace(replace.original, Data);
        })

        return message;
    }
}