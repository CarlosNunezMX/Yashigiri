import ExportedFlow from "../api/exportable_flow";
import { Answer, type Flow } from "../core";

export default function exportFlow(flow: Flow<any>) {
    const exported = new ExportedFlow(
        Answer.export(flow.start),
        flow.uuid,
        flow.name
    );
    let current: Answer<any> | undefined = flow.start.next;
    while (current) {
        exported.children.push(Answer.export(current));
        current = current.next;
    }
    return exported;
}