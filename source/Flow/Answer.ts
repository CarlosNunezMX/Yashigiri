import type {Context} from "./Context.js";

export abstract class Answer<ContextType = Context> {
    handler(ctx: ContextType): void | Promise<void> { };
    waitForAnswer: boolean = false;
}

export interface AnswerConstructor{
    new(): Answer;
}