declare class Lists {
    protected Lists: string[];
    add(jid: string | string[]): string[] | undefined;
    get(jid: string): boolean;
}
export declare class BlackList extends Lists {
}
export declare class WhiteList extends Lists {
    get(jid: string): boolean;
}
export {};
