import { Flow } from "../core";

export default interface IManagerAdapter {
  attach(socket: any): IManagerAdapter;
  addFlow(flow: Flow<any>): IManagerAdapter;
  moveFlow(id: string, flow: Flow<any> | string): IManagerAdapter;
  useFallback(flow: string | Flow<any>): IManagerAdapter;
}

