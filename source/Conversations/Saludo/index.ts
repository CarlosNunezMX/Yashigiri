import { Flow } from "../../Flow/Flow.js";
import { MenuFlow } from "../Menu/index.js";
import { Saludo } from "./controller.js";

export const FlowSaludo = new Flow()
    .addKeyboard(['hello', 'sup', 'whats doing'])
    .addKeyboard({
        key: ["hola", 'que onda', 'weee'],
        mode: 'equals',
        sensitive: false
    })
    .addKeyboard('alguien ahi')
    .addAnswer('Hola, cual es tu nombre?')
    .addAnswer(Saludo)
    .addAnswer("Será redirigido al menú...")
    .setNextFlow(MenuFlow)

FlowSaludo.flowName = "Saludo"
