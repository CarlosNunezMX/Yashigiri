import type { Database } from "./Database.js";
export declare class Memo {
    database?: Database;
    setDatabase(database: Database): void;
    private Memo;
    reset: (jid: string) => void;
    /***
     *	Message Format:
     *		"Hola {name}, tu estado es {status}"
     *
     *	Output:
     *		"Hola Carlos Nu, tu estado es VIGENTE!"
     * ***/
    useMemoText: (jid: string, message: string) => string;
    useMemo: <MemoType>(jid: string, key: string, value?: MemoType) => MemoType;
    private static instance;
    static getInstance(): Memo;
}
