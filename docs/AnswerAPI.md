# Answer
Add dynamic answers to your bot! That was hard to implement, so i hope you enjoy that!

## ***abstract** class Answer*
> You couldn't create an instance of this class!

To use it you need to extend the base class `Answer` making yours. You could use async/await out the box!
```ts
export class AskForFeelings extends Answer{
    constructor(){
        super(); // important!
    }
}
```

### handle
This method will be called when the flow gets at that position. It will recive the context for paramether
> Reference for [**ContextAPI**](./ContextAPI.md)
```ts
    handle(ctx: Context): void | Promise<void>{
        // your logic here
    }
```

### waitForNext
If you use it the flow will stop until the user send another message.
```ts
waitForNext: boolean;
```