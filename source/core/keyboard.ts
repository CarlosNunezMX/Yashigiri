export enum KeyboardType {
    WORDS,
    REGEX
}

interface KeyWord {
    keys: string | string[];
    sensitive?: boolean
    contains?: boolean
};

export type KeyTypeMap = {
    [KeyboardType.WORDS]: KeyWord;
    [KeyboardType.REGEX]: RegExp
}

export type KeyTypeMapConstructor = KeyTypeMap & {
    [KeyboardType.REGEX]: string | RegExp
}

export default class ActivactionKey<type extends KeyboardType> {
    public attr: KeyTypeMap[type];
    constructor(
        public readonly type: type,
        attr: KeyTypeMapConstructor[type]
    ) {
        this.attr = this._onbuild(attr);
    }

    private _onbuild(attr: KeyTypeMapConstructor[type]): KeyTypeMap[type] {
        if (this.type === KeyboardType.REGEX && attr! instanceof RegExp)
            return new RegExp(attr) as KeyTypeMap[type];
        return attr;
    }

    public static export(key: ActivactionKey<any>) {
        if (key.attr instanceof RegExp) key.attr = key.attr.source;
        return key;
    }
}
