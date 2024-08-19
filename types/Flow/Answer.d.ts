import type { Context } from "./Context.js";
export declare abstract class Answer<ContextType = Context> {
    handler(ctx: ContextType): void | Promise<void>;
    waitForAnswer: boolean;
}
export interface AnswerConstructor {
    new (): Answer;
}
