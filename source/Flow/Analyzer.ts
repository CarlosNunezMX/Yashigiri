import type { Flow, TKeyboard } from "./Flow.js";

export class Analyzer {
  private Flows: Flow[];

  constructor(availableFlows: Flow[]) {
    this.Flows = availableFlows;
  }

  addFlow = (flow: Flow) => {
    this.Flows.push(flow);
  }

  hasFlow = (flow: Flow): boolean => {
    return this.Flows.some(f => f.flowName === flow.flowName);
  }

  private equals(message: string, key: TKeyboard, flow: Flow): Flow | undefined {
    const msg = message.toLowerCase();

    if (typeof key.key === "string") {
      if (msg === key.key.toLowerCase()) {
        return flow.copy();
      }
    } else if (Array.isArray(key.key)) {
      if (key.key.some(k => msg === k.toLowerCase())) {
        return flow.copy();
      }
    }
    return undefined;
  }

  parse = (message: string): Flow | undefined => {
    const msg = message.toLowerCase();

    for (const flow of this.Flows) {
      if (!flow.Keyboards) continue;

      for (const key of flow.Keyboards) {
        if (typeof key === "string") {
          if (msg.includes(key.toLowerCase())) {
            return flow.copy();
          }
          continue;
        }

        if (typeof key === "object") {
          // Mode: equals
          if (key.mode === "equals") {
            const ans = this.equals(message, key, flow);
            if (ans) return ans;
          }

          // Mode: sensitive (includes, case-sensitive)
          if (key.sensitive) {
            if (typeof key.key === "string") {
              if (message.includes(key.key)) {
                return flow.copy();
              }
            } else if (Array.isArray(key.key)) {
              if (key.key.some(k => message.includes(k))) {
                return flow.copy();
              }
            }
          }
        }
      }
    }

    return undefined;
  }
}

export default new Analyzer([]);
