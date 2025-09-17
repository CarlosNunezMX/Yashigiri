import { MessageTools } from "./messagetools.js";

export namespace Utils {
    export const message = MessageTools;
    export function delay(ms: number){
        return new Promise<void>(res => setTimeout(() => res() , ms))   
    }
}