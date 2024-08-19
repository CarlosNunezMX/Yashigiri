import type {Flow} from "./Flow";

export declare class Database {
    getMemo<value>(jid: string, key?: string): Promise<value | null>;
    getMemo<rv>(jid: string): Promise<rv | null>;

    getFlow(jid: string, key?: string): Promise<Flow | null>;

    setFlow(jid: string, value: Flow | null): Promise<void>;
    setMemo<value>(jid: string, key: string, value: value): Promise<void>;

    clearMemo(jid: string): Promise<void>;

    private connection(): Promise<void> | void;
    private isConnected: boolean;
    private connectionString?: string;

    public recoverFlows(): Promise<Map<string, Flow>>;
}