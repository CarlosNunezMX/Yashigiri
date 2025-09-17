import type { AnyMessageContent, BaileysEventMap, proto, WASocket } from "baileys";
import { Analyzer, Answer, BlackList, CAnalyzer, Context, Manager, Memo, WhiteList, type Flow } from "../index.js";
import type { WAMessageEvent } from "./Manager.js";
import { Utils } from "./utils/utils.js";
import type { AnswerConstructor } from "./Answer.js";

class NeoManager {
    protected Flows: Map<string, Flow> = new Map();
    protected ContextReference: typeof Context = Context;
    protected Analyzer: CAnalyzer = Analyzer;
    protected Memo = new Memo();
    protected delay?: number;
    protected events: WAMessageEvent[] = [];
    protected defaultFlow?: Flow;
    protected WASock?: WASocket;

    protected waiting = false;


    public setDelay(ms: number) {
        this.delay = ms;
    }

    public async useDelay() {
        if(this.delay)
            await Utils.delay(this.delay!);
    }


    public setDefaultFlow(flow: Flow) {
        this.defaultFlow = flow;
    }

    public addFlow(flow: Flow) {
        this.Analyzer.addFlow(flow);
        return this;
    }

    protected selectFlow(jid: string, message: string) {
        const desiredFlow = this.Analyzer.parse(message);
        if (!desiredFlow) return;
        this.Flows.set(jid, desiredFlow);
        return desiredFlow;
    }

    protected onMessage(ctx: BaileysEventMap["messages.upsert"]) {
        const message = ctx.messages[0];
        if (!message) return;
        const jid = message.key.remoteJid!;
        const recivedMessage = Utils.message.selectMessage(message.message!)!;

        if (message.key.fromMe)
            return;

        let flow = this.Flows.get(jid);
        if (!flow && !(recivedMessage as proto.Message.IDocumentMessage).mimetype)
            flow = this.selectFlow.bind(this)(jid, Utils.message.toString(recivedMessage));
    }
    protected reset(jid: string) {

    }
    protected makeStep(jid: string, message: proto.IWebMessageInfo) {
        // Retrive flow
        const flow = this.Flows.get(jid);
        if (!flow)
            throw "Not flow registered to " + jid;
        // Try to get next answer
        flow.CurrentAnswer++;
        if (!flow.getCurrentAnswer()) {
            // Reset if last answer
            return this.reset(jid);
        }
        this.Flows.set(jid, flow);
        this.runFlow.bind(this)(jid, message);
    }

    protected async runFlow(jid: string, message: proto.IWebMessageInfo) {
        const flow = this.Flows.get(jid)!;
        const answer = flow?.getCurrentAnswer();

        if (typeof answer === "string") {
            // String answer
            await this.useDelay();
            await this.WASock?.sendMessage(jid, { text: this.Memo.useMemoText(jid, answer) }, { quoted: message })
            this.makeStep.bind(this)(jid, message);
        } else if ((answer as typeof Answer).prototype && (answer as typeof Answer).prototype instanceof Answer) {
            // Answer API like
            const builded_answer = new (answer as AnswerConstructor)();

            if (builded_answer.waitForAnswer && !this.waiting) {
                this.waiting = true;
                return;
            }

            if (!builded_answer.waitForAnswer || (builded_answer.waitForAnswer && this.waiting)) {
                const ctx = new this.ContextReference(message, this.WASock!, flow);
                const response = builded_answer.handler(ctx);
                if(response instanceof Promise){
                    await response;
                }
                this.waiting = false;
                this.makeStep.bind(this)(jid, message);
            }
        }
        else {
            await this.useDelay()            
            this.WASock?.sendMessage(jid, (answer as AnyMessageContent));
            this.makeStep.bind(this)(jid, message);
        }


    }

    public moveToFlow(jid: string, flow: Flow) {
        this.Flows.set(jid, flow);
    }

    public moveToStep(jid: string, step: number) {
        const flow = this.Flows.get(jid);
        if (!flow)
            throw "Could not move!";
        flow.skipToStep(step);
        this.Flows.set(jid, flow);
    }

    public attach(whatsapp_context: WASocket) {
        this.WASock = whatsapp_context;
        this.WASock.ev.on("messages.upsert", this.onMessage.bind(this))
    }
}