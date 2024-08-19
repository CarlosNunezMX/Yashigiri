import type { Flow } from "./Flow.js";
export declare class Analyzer {
    private Flows;
    constructor(availableFlows: Flow[]);
    addFlow: (flow: Flow) => void;
    hasFlow: (flow: Flow) => Flow | undefined;
    parse: (message: string) => Flow | undefined;
}
