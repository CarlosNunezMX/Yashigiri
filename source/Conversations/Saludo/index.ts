import { Flow } from "../../Flow/Flow.js";
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
    .addAnswer({
        text: "Adios"
    });

FlowSaludo.flowName = "Saludo"
