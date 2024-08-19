import type { AnyMessageContent } from "baileys";
import type { AnswerConstructor } from "./Answer.js";
export type Keyboard = {
    key: string[] | string;
    mode?: "equals" | "contains";
    sensitive?: boolean;
} | string;
export declare class Flow {
    flowName: string;
    AreWeWaiting: boolean;
    Keyboards: Keyboard[];
    CurrentAnswer: number;
    getCurrentAnswer(): string | AnyMessageContent | AnswerConstructor;
    setName: (name: string) => Flow;
    skipToStep(step: number): void;
    copy(): Flow;
    private Answers;
    getNext(): (AnswerConstructor | string | AnyMessageContent) | undefined;
    nextFlow?: Flow;
    /**
     *
     * @param keyboard This paramether will define how the message will be proccesed.
     * @description By default if you use a string, the message will be proccessed in lowercase and in _contains_ mode
     * @description You have the `Keyboard` type where you could set the mode and if its case sensitive
     */
    addKeyboard(keyboard: Keyboard | string[]): Flow;
    addAnswer(answer: AnswerConstructor | AnswerConstructor[] | string | string[] | AnyMessageContent | AnyMessageContent[]): this;
    /**
     *
     * @param flow The flow what you want to be the next when this finishes.
     * > **UNTESTED!** - Don't use it under production enviroment!
     */
    setNextFlow(flow: Flow): this;
}
