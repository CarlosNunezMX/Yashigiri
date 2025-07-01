import type { Flow, TKeyboard } from "./Flow.js";

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

  private equals(message: string, key: TKeyboard, flow: Flow) {
    if (typeof key.key === "string") {
      if (message.toLowerCase() === (key.key as string).toLowerCase()) {
        return flow.copy();
      }
    }
    else {
      if ((key.key as string[]).some(k => message.toLowerCase() === k.toLowerCase()))
        return flow.copy()
    }
  }
  parse = (message: string) => {
    for (const flow of this.Flows) {
      for (const key of flow.Keyboards) {
        if (typeof key === "string") {
          if (message.includes(key.toLowerCase()))
            return flow.copy();
        }
        if (typeof key === "object") {
          if (key.mode === "equals") {
            const ans = this.equals(message, key, flow);
            if(ans) return ans;
          }

          if (key.sensitive) {
            if (typeof key.key === "string") {
              if (!message.includes(key.key))
                return;
              return flow.copy();
            }
            else if (Array.isArray(key.key)) {
              if (!key.key.some(k => message.includes(k)))
                return;
              return flow.copy()
            }
          }
        }
      }
    }
  }
}