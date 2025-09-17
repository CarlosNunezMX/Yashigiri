import type { ExportedAnswer } from "../api/exportable_answer";
import type ExportedFlow from "../api/exportable_flow";
import { Answer } from "../core";

export class RebuiltAnswer {
    constructor(
        public uuid: string,
        public next?: string,
        public previous?: string
    ) { };

    public static buildFromExportedAnswer(answer: ExportedAnswer<any>) {
        return new RebuiltAnswer(answer.uuid, answer.next, answer.previous);
    }
}
export default function rebuildFlow(flow: ExportedFlow<any>) {
    const { children, main } = flow;
    const rebuiltChildren = new Map<string, Answer<any>>();
    const referencesMap = new Map<string, RebuiltAnswer>();
    const rebuiltMain = Answer.import(main);
    for (let child of children) {
        rebuiltChildren.set(child.uuid, Answer.import(child));
        referencesMap.set(child.uuid, RebuiltAnswer.buildFromExportedAnswer(child));
    }

    for (let [_, raw] of referencesMap) {
        const currentNode = rebuiltChildren.get(raw.uuid),
            rebuiltNext = rebuiltChildren.get(raw.next ?? ""),
            rebuiltPrevious = rebuiltChildren.get(raw.previous ?? "");


        if (!currentNode) throw "La lista esta rota.";
        currentNode.next = rebuiltNext;
        currentNode.previous = rebuiltPrevious;

        rebuiltChildren.set(raw.uuid, currentNode);
    }

    rebuiltMain.next = rebuiltChildren.get(main.next ?? "");
    // link next with main
    if(rebuiltMain.next) rebuiltMain.next.previous = rebuiltMain;
    rebuiltMain.previous = rebuiltChildren.get(main.previous ?? "");
    return rebuiltMain;
}