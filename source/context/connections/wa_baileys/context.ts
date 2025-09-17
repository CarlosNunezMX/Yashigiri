import type {
  AnyMessageContent,
  proto,
  WAMessage,
  WAPresence,
  WASocket,
} from "baileys";
import type IContextRepo from "../../../core/contex_repo";
import { BaileysContextAdapter } from "./adapters";
import type { Flow } from "../../../core";
import UserInfo from "../../classes/UserInfo";

export default class BaileysContext
  implements IContextRepo<BaileysContextAdapter>
{
  body: string;
  originalBody: proto.IWebMessageInfo;
  senderInfo: UserInfo<proto.IMessageKey>;

  constructor(
    private socket: WASocket,
    public message: WAMessage,
    public flow: Flow<any>
  ) {
    this.body =
      message.message?.extendedTextMessage?.text ||
      message.message?.conversation ||
      "";
    this.originalBody = message;
    this.senderInfo = this.buildSenderInfo(message);
  }

  async reply(
    reply: AnyMessageContent
  ): Promise<proto.WebMessageInfo | undefined> {
    if (typeof reply === "string")
      return this.socket.sendMessage(
        this.senderInfo.userID,
        { text: reply },
        { quoted: this.message }
      );
    return this.socket.sendMessage(this.senderInfo.userID, reply, {
      quoted: this.message,
    });
  }

  async sendMessage(
    message: AnyMessageContent,
    to: string
  ): Promise<proto.WebMessageInfo | undefined> {
    if (typeof message === "string")
      return this.socket.sendMessage(to, { text: message });
    return this.socket.sendMessage(to, message);
  }

  async useDelay(ms: number): Promise<void> {
    return new Promise((res) => {
      setTimeout(() => res(), ms);
    });
  }

  setPresence(presence: WAPresence): Promise<void> {
    return this.socket.sendPresenceUpdate(presence, this.senderInfo.userID);
  }

  async useDelayWithPresence(ms: number): Promise<void> {
    await this.setPresence.bind(this)("composing");
    await this.useDelay(ms);
    await this.setPresence.bind(this)("available");
  }

  private buildSenderInfo(message: WAMessage) {
    return new UserInfo<proto.IMessageKey>(
      message.key.remoteJid!,
      "Not implemented",
      message.key
    );
  }
}
