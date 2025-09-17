import type { AnswerType } from "./answer";
import Answer from "./answer";
import rebuildFlow from "../private/rebuild_flow";
import exportFlow from "../private/export_flow";

export default class Flow<init extends AnswerType> {
    private current: Answer<init>;
    public readonly uuid: string;
    constructor(
        public name: string,
        public start: Answer<init>,
        uuid?: string
    ) {
        this.current = start;
        this.uuid = uuid ?? Bun.randomUUIDv7();
    };

    public get current_answer() {
        return this.current;
    }
    
    public static export = exportFlow.bind(this);
    public static import = rebuildFlow.bind(this);
};