import { Kind, type Context } from "../../Flow/Context.js";
import { Answer } from "../../Flow/Flow.js";

export class Saludo extends Answer {
    waitForAnswer: boolean = true;
    constructor(){
        super();
    }

    async handler(ctx: Context): Promise<void> {  
        ctx.useMemo(ctx.phoneNumber, 'name', ctx.body)
        await ctx.delayWithPresence('composing', 1, Kind.SECONDS)
        await ctx.reply(ctx.MemoText(ctx.phoneNumber, 'Holaaaa {name}!'));
        return;
    }
}