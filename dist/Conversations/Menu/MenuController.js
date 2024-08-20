import { Answer } from "../../Flow/Flow.js";
const cafes = ["Helado", "Con Leche", "Capuchino"];
export class MenuController extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        const option = Number(ctx.body[0]);
        if (isNaN(option) || !cafes[option - 1]) {
            await ctx.reply('Usted ha no ha seleccionado una opción valida!');
            ctx.moveToStep(ctx.phoneNumber, 0);
            return;
        }
        ctx.useMemo(ctx.phoneNumber, 'cafe', cafes[option - 1]);
        await ctx.reply(ctx.MemoText(ctx.phoneNumber, `Usted ha seleccionado Café {cafe}`));
    }
}
//# sourceMappingURL=MenuController.js.map