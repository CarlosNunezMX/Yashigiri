import type { AnswerType } from "../core/answer";
import type { ExportedAnswer } from "./exportable_answer";

export default class ExportedFlow<init extends AnswerType> {
    constructor(
        public main: ExportedAnswer<init>,
        public uuid: string,
        public name: string, 
        public children: ExportedAnswer<any>[] = [],
    ) { };
};