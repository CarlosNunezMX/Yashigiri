export class Memo {
    database;
    setDatabase(database) {
        this.database = database;
    }
    Memo = new Map();
    reset = (jid) => {
        this.Memo.delete(jid);
    };
    /***
     *	Message Format:
     *		"Hola {name}, tu estado es {status}"
     *
     *	Output:
     *		"Hola Carlos Nu, tu estado es VIGENTE!"
     * ***/
    useMemoText = (jid, message) => {
        let regex = new RegExp(/{\S+}/g);
        let StringOnlyRegex = new RegExp(/[A-z]+/g);
        let Variables = message.match(regex);
        if (!Variables)
            return message;
        let toReplaced = Variables.map(variable => ({
            token: (variable.match(StringOnlyRegex) ?? [])[0] ?? '',
            original: variable
        }));
        const memoJin = this.Memo.get(jid);
        toReplaced.forEach(replace => {
            let Data = memoJin?.get(replace.token) ?? 'Indefinido';
            message = message.replace(replace.original, Data);
        });
        return message;
    };
    useMemo = (jid, key, value) => {
        let _memo = this.Memo.get(jid);
        console.log(`Setting a variable ${key} for ${jid} with the value ${value}`);
        if (!_memo)
            _memo = new Map();
        const val = _memo.get(key);
        if (value) {
            console.debug(`Setting ${key} to ${value} for ${jid} with previus value ${val}`);
            _memo.set(key, value);
            this.Memo.set(jid, _memo);
            return value;
        }
        console.debug(`Reading ${key} from ${jid} where value is: ${val}`);
        return val;
    };
    static instance;
    static getInstance() {
        if (!Memo.instance) {
            Memo.instance = new Memo();
        }
        return Memo.instance;
    }
}
