class Lists {
    Lists = [];
    add(jid) {
        if (Array.isArray(jid))
            return this.Lists = this.Lists.concat(jid);
        this.Lists.push(jid);
    }
    get(jid) {
        return this.Lists.some(val => jid.includes(val));
    }
}
export class BlackList extends Lists {
}
;
export class WhiteList extends Lists {
    get(jid) {
        return !this.Lists.some(val => jid.includes(val));
    }
}
;
