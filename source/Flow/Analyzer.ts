import type { Flow } from "./Flow.js";

export class Analyzer {
    private Flows: Flow[];
    constructor(availableFlows: Flow[]) {
      this.Flows = availableFlows;
    }
  
    addFlow = (flow: Flow) => {
      this.Flows.push(flow);
    }
    hasFlow = (flow: Flow) => {
        return this.Flows.find(f => f.flowName === flow.flowName);
    }
    parse = (message: string) => {
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
              if ((key.key as string).toLowerCase() === message.toLowerCase()) {
                return flow.copy();
              }
            }
  
            if (key.sensitive) {
              if ((key.key as string).includes(message))
                return flow.copy();
              if ((key.key as string).toLowerCase().includes(message.toLowerCase()))
                return flow.copy();
            }
          }
        }
      }
    }
  }