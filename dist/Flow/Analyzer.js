export class Analyzer {
    Flows;
    constructor(availableFlows) {
        this.Flows = availableFlows;
    }
    addFlow = (flow) => {
        this.Flows.push(flow);
    };
    hasFlow = (flow) => {
        return this.Flows.find(f => f.flowName === flow.flowName);
    };
    parse = (message) => {
        for (const flow of this.Flows) {
            for (const key of flow.Keyboards) {
                if (typeof key === "string") {
                    if (key.includes(message.toLowerCase()))
                        return flow.copy();
                }
                if (typeof key === "object") {
                    if (key.mode === "equals") {
                        if (key.sensitive && key.key === message) {
                            return flow.copy();
                        }
                        if (key.key.toLowerCase() === message.toLowerCase()) {
                            return flow.copy();
                        }
                    }
                    if (key.sensitive) {
                        if (key.key.includes(message))
                            return flow.copy();
                        if (key.key.toLowerCase().includes(message.toLowerCase()))
                            return flow.copy();
                    }
                }
            }
        }
    };
}
