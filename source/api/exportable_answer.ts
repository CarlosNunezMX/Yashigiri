import type Answer from "../core/answer";
import type { AnswerType } from "../core/answer";

export type ExportedAnswer<type extends AnswerType> = Answer<type> & Partial<{
    next: string;
    previous: string;
}>;