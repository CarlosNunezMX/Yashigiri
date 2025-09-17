import FlowNotFount from "../errors/FlowNotFount";
import type IManagerAdapter from "../manager/IManagerAdapter";
import type Flow from "./flow";

export default class BaseManager implements IManagerAdapter {
  protected flows: Flow<any>[] = [];
  protected state = new Map<string, Flow<any>>();
  protected fallback?: Flow<any>;
  addFlow(flow: Flow<any>): IManagerAdapter {
    this.flows.push(flow);
    return this;
  }
  attach(socket: any): IManagerAdapter {
    return this;
  }

  useFallback(flow: string | Flow<any>): IManagerAdapter {
    if (typeof flow === "string") {
      let toFlow = this.flows.find(
        (item) => item.name === (flow as unknown as string)
      );
      if (!toFlow) throw new FlowNotFount();
      flow = toFlow;
    }

    this.fallback = flow;
    return this;
  }

  public moveFlow(id: string, flow: Flow<any> | string): IManagerAdapter {
    if (typeof flow === "string") {
      let toFlow = this.flows.find(
        (item) => item.name === (flow as unknown as string)
      );
      if (!toFlow) throw new FlowNotFount();
      flow = toFlow;
    }

    this.state.set(id, flow);
    return this;
  }
}
