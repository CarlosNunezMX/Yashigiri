# Answer
Add dynamic answers to your bot! That was hard to implement, so i hope you enjoy that!

## ***abstract** class Answer*
> You couldn't create an instance of this class!

To use it you need to extend the base class `Answer` making yours. You could use async/await out the box!
```ts
export class AskForFeelings extends Answer<ContextType = Context>{
    constructor(){
        super(); // important!
    }
}
```

### handle
This method will be called when the flow gets at that position. It will recive the context for paramether
> Reference for [**ContextAPI**](./ContextAPI.md)
```ts
    handle(ctx: ContextType): void | Promise<void>{
        // your logic here
    }
```

### waitForNext
If you use it the flow will stop until the user send another message.
```ts
waitForNext: boolean;
```

## Extending Context
If you want to extend the context you need to declare what context provider are you using,
The method is so easy, you only need to import your class and put in in answer 🤓.

```ts
 class ExampleAnswer extends Answer<ExampleContext> /** <-- Here is the declaration**/ {};
 ```

### Using in handler
Well you had put the context in answer, so then you need to use the context with your answer function 😖
```ts
handler(ctx: ExampleContext){}
```
**Easy right? right?**