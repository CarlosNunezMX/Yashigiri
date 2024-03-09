import type { AnyMessageContent, BaileysEventMap, WASocket, WAMessage, proto } from "@whiskeysockets/baileys";
import type { Context } from "./Context.js";

export abstract class Answer {
  handler(ctx: Context): void | Promise<void> { };
  waitForAnswer: boolean = false;
}

export interface AnswerConstructor{
  new(): Answer;
}



export type Keyboard = {
  key: string[] | string,
  mode?: "equals" | "contains",
  sensitive?: boolean
} | string;

export class Flow {
  flowName: string = '';
  public Keyboards: Keyboard[] = [];
  CurrentAnswer = 0;
  getCurrentAnswer(){
    return this.Answers[this.CurrentAnswer];
  }

  copy() {
    return Object.assign<Flow, Flow>(Object.create(Object.getPrototypeOf(this)), this);
  }

  private Answers: Array<typeof Answer | string | AnyMessageContent> = [];
  getNext(): (typeof Answer | string | AnyMessageContent) | undefined{
    return this.Answers[this.CurrentAnswer + 1];
  }
  /**
   * 
   * @param keyboard This paramether will define how the message will be proccesed.
   * @description By default if you use a string, the message will be proccessed in lowercase and in _contains_ mode
   * @description You have the `Keyboard` type where you could set the mode and if its case sensitive
   */
  addKeyboard(keyboard: Keyboard | string[]): Flow {
    if (typeof keyboard === "string") {
      this.Keyboards.push(keyboard.toLowerCase());
      return this;
    }
    
    if( Array.isArray(keyboard as string[]) ){
      this.Keyboards = this.Keyboards.concat(keyboard);
      return this;
    }


    // Si detectamos que el dev nos envio un arreglo para las respuestas, debemos copiar la configuracion y meter al arreglo 
    // las respuestas por separado.
    // @ts-ignore
    if (typeof keyboard === 'object' && Array.isArray(keyboard.key as string[])) {
      // @ts-ignore
      (keyboard.key as string[]).forEach(key => {
        this.Keyboards.push({
          ...keyboard,
          key
        });
      })
      return this;
    }

    return this;
  }


  addAnswer(answer: typeof Answer | typeof Answer[] | string | string[] | AnyMessageContent | AnyMessageContent[]) {
    if (!Array.isArray(answer))
      this.Answers.push(answer);
    else this.Answers = this.Answers.concat(answer);
    return this;
  }
};



