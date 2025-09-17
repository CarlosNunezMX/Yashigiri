import type { ExportedAnswer } from "../api/exportable_answer";

export enum AnswerType {
    TEXT,
    IMAGE,
    JS_SRV_CB
};

export type AnswerMap = {
    [AnswerType.TEXT]: { value: string };
    [AnswerType.IMAGE]: { url: string };
    [AnswerType.JS_SRV_CB]: undefined;
}



export default class Answer<type extends AnswerType> {
    public readonly uuid: string;
    public next?: Answer<any>
    public previous?: Answer<any>
    constructor(
        public answerType: type,
        public answerContent: AnswerMap[type],
        uuid?: string
    ) {
        this.uuid = uuid ?? Bun.randomUUIDv7();
    };

    setNext<next extends AnswerType>(next: Answer<next>) {
        if (!this.next) {
            this.next = next;
            this.next!.previous = this;
            return this;
        }
        this.next.setNext(next);
        return this;
    }

    static export<type extends AnswerType>(answer: Answer<type>): ExportedAnswer<type> {
        return {
            ...answer,
            next: answer.next?.uuid,
            previous: answer.previous?.uuid
        } as ExportedAnswer<type>
    }

    static import<type extends AnswerType>(answer: ExportedAnswer<type>) {
        return new Answer(answer.answerType, answer.answerContent, answer.uuid);
    }
}