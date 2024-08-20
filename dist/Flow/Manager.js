import { Flow } from "./Flow.js";
import { Answer } from "./Answer.js";
import { Analyzer } from "./Analyzer.js";
import { Context } from "./Context.js";
import { BlackList, WhiteList } from "./Lists.js";
import { Memo } from "./Memo.js";
export class Manager {
    database;
    BlackList;
    WhiteList;
    delay = 1000;
    Memo = Memo.getInstance();
    ContextReference = Context;
    Analyzer = new Analyzer([]);
    events = [];
    setDatabase(database) {
        this.database = database;
    }
    setDelay(ms) {
        this.delay = ms;
    }
    useBlackList = (bl) => {
        this.BlackList = bl;
        return this;
    };
    useContext(newContext) {
        this.ContextReference = newContext;
    }
    someEvent(Message) {
        const [event] = Object.keys(Message)[0];
        return this.events.some(ev => ev === event) || !Message.key.participant;
    }
    useEventDisabler = (events) => {
        if (!Array.isArray(events)) {
            this.events.push(events);
            return this;
        }
        this.events = this.events.concat(events);
        return this;
    };
    useWhiteList = (wl) => {
        this.WhiteList = wl;
        return this;
    };
    haveReset = (jid, context) => {
        const flow = this.Flows.get(jid);
        const haveNext = flow.getNext();
        if (!haveNext) {
            if (!flow.nextFlow) {
                this.Memo.reset(jid);
                return this.Flows.delete(jid);
            }
            this.Flows.set(jid, flow.nextFlow.copy());
            return this.FlowQueue(context);
        }
        flow.CurrentAnswer++;
        this.FlowQueue(context);
    };
    moveToStep = (jid, step) => {
        const flow = this.Flows.get(jid);
        flow.skipToStep(step);
        this.Flows.set(jid, flow);
    };
    SocketConnection;
    Flows = new Map();
    attach = (whatsapp_context) => {
        this.SocketConnection = whatsapp_context;
        this.SocketConnection.ev.on('messages.upsert', this.getMessage.bind(this));
    };
    async _delay(ms) {
        return new Promise((res, rej) => {
            setTimeout(() => res(), ms);
        });
    }
    async useDelay(jid) {
        await this.SocketConnection?.sendPresenceUpdate("composing", jid);
        await this._delay(this.delay);
        await this.SocketConnection?.sendPresenceUpdate('available', jid);
    }
    reset = (jid) => {
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
            this.Flows.delete(jid);
            this.Memo.reset(jid);
            return false;
        }
        return false;
    };
    addFlow = (flow) => {
        if (Array.isArray(flow)) {
            flow.forEach(f => this.Analyzer.addFlow(f));
            return this;
        }
        this.Analyzer.addFlow(flow);
        return this;
    };
    sendToFlow = (flow, jid) => {
        this.Flows.set(jid, flow);
    };
    FlowNotFountMessage = "";
    getMessage = async (context) => {
        const cellPhone = context.messages[0].key.remoteJid;
        const message = context.messages[0].message?.extendedTextMessage?.text || context.messages[0].message?.conversation;
        if (!this.someEvent(context.messages[0]))
            return;
        if ((this.BlackList && this.BlackList.get(cellPhone)))
            return;
        if ((this.WhiteList && this.WhiteList.get(cellPhone)))
            return;
        // @ts-ignore
        let flow = this.Flows.get(cellPhone);
        // if the message had sent by us, we don't make anything
        if (!message || context.messages[0].key.fromMe)
            return;
        // if the flow wasn't found we will create one with the analyzer class
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
    };
    // TODO: implement what to do when flow gets on its end.
    FlowQueue = async (context) => {
        const jid = context.messages[0].key.remoteJid;
        const flow = this.Flows.get(jid);
        const CurrentAnswer = flow.getCurrentAnswer();
        if (typeof CurrentAnswer === "string") {
            console.log('Answer is of string type.');
            await this.useDelay(jid);
            this.SocketConnection?.sendMessage(jid, {
                text: this.Memo.useMemoText(jid, CurrentAnswer)
            });
            this.haveReset(jid, context);
        }
        else if (CurrentAnswer.prototype && CurrentAnswer.prototype instanceof Answer) {
            console.log("Answer is AnswerAPI like");
            const nanswer = new CurrentAnswer();
            // here is the logic to the context messages
            if (nanswer.waitForAnswer && !flow.AreWeWaiting) {
                flow.AreWeWaiting = true;
                this.Flows.set(jid, flow);
                console.log(this.Flows.get(jid));
                return;
            }
            if (nanswer.waitForAnswer && flow.AreWeWaiting) {
                const response = nanswer.handler(new this.ContextReference(context.messages[0], 
                // @ts-ignore
                this.SocketConnection, 
                // this is the flow instance :D
                flow));
                if (response instanceof Promise) {
                    return response.then(() => {
                        flow.AreWeWaiting = false;
                        this.Flows.set(jid, flow);
                        this.haveReset(jid, context);
                    });
                }
                flow.AreWeWaiting = false;
                this.Flows.set(jid, flow);
                this.haveReset(jid, context);
            }
            if (!nanswer.waitForAnswer) {
                const response = nanswer.handler(new this.ContextReference(context.messages[0], 
                // @ts-ignore
                this.SocketConnection, flow));
                if (response instanceof Promise) {
                    await response.then();
                }
                this.haveReset(jid, context);
            }
        }
        if (typeof CurrentAnswer === "object") {
            console.log("Answer is Baileys-Like");
            await this.useDelay(jid);
            this.SocketConnection?.sendMessage(jid, CurrentAnswer);
            this.haveReset(jid, context);
        }
    };
    static Instance;
    static getInstance() {
        if (!this.Instance)
            this.Instance = new Manager();
        return this.Instance;
    }
}
