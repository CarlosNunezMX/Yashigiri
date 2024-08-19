import type {Database} from "./Database";
export class Memo {
    database?: Database;
    public setDatabase(database: Database) {
        this.database = database;
    }

    private Memo: Map<string, Map<string, any>> = new Map();

    public reset = (jid: string): void => {
        this.Memo.delete(jid);
    }
    /***
     *	Message Format:
     *		"Hola {name}, tu estado es {status}"
     *
     *	Output:
     *		"Hola Carlos Nu, tu estado es VIGENTE!"
     * ***/
    useMemoText = (jid: string, message: string): string => {
        let regex = new RegExp(/{\S+}/g);
        let StringOnlyRegex = new RegExp(/[A-z]+/g);

        let Variables = message.match(regex);
        if (!Variables)
            return message;

        let toReplaced = Variables.map(variable => ({
            token: (variable.match(StringOnlyRegex) ?? [])[0] ?? '',
            original: variable
        }))

        const memoJin = this.Memo.get(jid);
        toReplaced.forEach(replace => {
            let Data = memoJin?.get(replace.token) ?? 'Indefinido';
            message = message.replace(replace.original, Data);
        })

        return message;
    }

    public useMemo = <MemoType>(jid: string, key: string, value?: MemoType): MemoType => {
        let _memo = this.Memo.get(jid);
        console.log(`Setting a variable ${key} for ${jid} with the value ${value}`);

        if (!_memo)
            _memo = new Map()
        const val = _memo.get(key);
        if (value) {
            console.debug(`Setting ${key} to ${value} for ${jid} with previus value ${val}`);
            _memo.set(key, value);
            this.Memo.set(jid, _memo);
            return value;
        }
        console.debug(`Reading ${key} from ${jid} where value is: ${val}`);
        return val
    }

    private static instance: Memo;
    public static getInstance(){
        if(!Memo.instance){
            Memo.instance = new Memo();
        }
        return Memo.instance;
    }
}