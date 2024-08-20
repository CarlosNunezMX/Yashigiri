export class Flow {
    flowName = '';
    AreWeWaiting = false;
    Keyboards = [];
    CurrentAnswer = 0;
    getCurrentAnswer() {
        return this.Answers[this.CurrentAnswer];
    }
    setName = (name) => {
        this.flowName = name;
        return this;
    };
    skipToStep(step) {
        if (!this.Answers[step])
            return;
        this.CurrentAnswer = step;
    }
    copy() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
    Answers = [];
    getNext() {
        return this.Answers[this.CurrentAnswer + 1];
    }
    nextFlow;
    /**
     *
     * @param keyboard This paramether will define how the message will be proccesed.
     * @description By default if you use a string, the message will be proccessed in lowercase and in _contains_ mode
     * @description You have the `Keyboard` type where you could set the mode and if its case sensitive
     */
    addKeyboard(keyboard) {
        if (typeof keyboard === "string") {
            this.Keyboards.push(keyboard.toLowerCase());
            return this;
        }
        if (Array.isArray(keyboard)) {
            this.Keyboards = this.Keyboards.concat(keyboard);
            return this;
        }
        // Si detectamos que el dev nos envio un arreglo para las respuestas, debemos copiar la configuracion y meter al arreglo 
        // las respuestas por separado.
        // @ts-ignore
        if (typeof keyboard === 'object' && Array.isArray(keyboard.key)) {
            // @ts-ignore
            keyboard.key.forEach(key => {
                this.Keyboards.push({
                    ...keyboard,
                    key
                });
            });
            return this;
        }
        return this;
    }
    addAnswer(answer) {
        if (!Array.isArray(answer))
            this.Answers.push(answer);
        else
            this.Answers = this.Answers.concat(answer);
        return this;
    }
    /**
     *
     * @param flow The flow what you want to be the next when this finishes.
     * > **UNTESTED!** - Don't use it under production enviroment!
     */
    setNextFlow(flow) {
        this.nextFlow = flow;
        return this;
    }
}
;
