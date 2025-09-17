import type { Flow } from ".";
import type UserInfo from "../context/classes/UserInfo";
import type IConextAdapter from "../context/classes/IContextAdapter";

export default interface IContextRepo<adapter extends IConextAdapter> {
  senderInfo: UserInfo<adapter["meta"]>;
  body: string;
  originalBody: adapter["messageBody"];

  //    useMove(flow: Flow<any>): void;
  useDelay(ms: number): Promise<void>;
  useDelayWithPresence(ms: number): Promise<void>;
  setPresence(presence: adapter["presence"]): Promise<void>;

  reply(
    reply: adapter["sendMessageBody"]
  ): Promise<adapter["sentMessage"] | undefined>;
  sendMessage(
    message: adapter["sendMessageBody"],
    to: string
  ): Promise<adapter["sentMessage"] | undefined>;

  //useSetMemo(key: string, value: any): void;
  //useMemo<val extends string>(key: string): val | undefined;

  //useGoBack(): void;
}
