import type { AnyMessageContent, BaileysEventMap, WASocket, WAMessage, proto } from "baileys";
import type { Context } from "./Context.js";
import type {AnswerConstructor} from "./Answer.js";




export type Keyboard = {
  key: string[] | string,
  mode?: "equals" | "contains",
  sensitive?: boolean
} | string;

export class Flow {
  flowName: string = '';
  public AreWeWaiting: boolean = false;
  public Keyboards: Keyboard[] = [];
  CurrentAnswer = 0;
  getCurrentAnswer() {
    return this.Answers[this.CurrentAnswer];
  }
  setName = (name: string): Flow => {
    this.flowName = name;
    return this;
  }
  skipToStep(step: number){
    if(!this.Answers[step])
      return;
    this.CurrentAnswer = step;
  }

  copy(){
    return Object.assign<Flow, Flow>(Object.create(Object.getPrototypeOf(this)), this);
  }

  private Answers: Array<AnswerConstructor | string | AnyMessageContent> = [];
  getNext(): (AnswerConstructor | string | AnyMessageContent) | undefined{
    
    return this.Answers[this.CurrentAnswer + 1];
  }
  nextFlow?: Flow;
  /**
   * 
   * @param keyboard This paramether will define how the message will be proccesed.
   * @description By default if you use a string, the message will be proccessed in lowercase and in _contains_ mode
   * @description You have the `Keyboard` type where you could set the mode and if its case sensitive
   */
  addKeyboard(keyboard: Keyboard | string[]): Flow{
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


  addAnswer (answer: AnswerConstructor | AnswerConstructor[] | string | string[] | AnyMessageContent | AnyMessageContent[]) {
    if (!Array.isArray(answer))
      this.Answers.push(answer);
    else this.Answers = this.Answers.concat(answer);
    
    return this;
  }
  
  /**
   * 
   * @param flow The flow what you want to be the next when this finishes.
   * > **UNTESTED!** - Don't use it under production enviroment!
   */
  setNextFlow  (flow: Flow) {
    this.nextFlow = flow;
    return this;
  }
};



