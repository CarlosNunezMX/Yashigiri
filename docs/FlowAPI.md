# Flows
Flows are conversations represented by a cicle, so they can be automatized.

## *class Flow*
This class is the base of this project, this class defines a conversational flow.

### Instancing
Here we're creating a new Flow.
```ts
const GreetingFlow = new Flow();
```

### Setting a name
This is important for the future, if you dont give a name to your flows
you cant use the `Analyze` class.
```ts
GreetingFlow.flowName = "Greet";
```

### Adding Keyboards
We've a lot of ways to add keyboards, whose job is activate the flow when the message contains one of those keys.

```ts
// Adding one
GreetFlow.addKeyboard('hi');

// Adding more
GreetFlow.addKeyboard(['sup', 'what\'s up']);

// Using keyboard api
GreetFlow.addKeyboard({
    mode: "contains",
    sensitive: false,
    keys: ['yo!', 'おはようございます。']
})
```

### Adding answers
Oh, now you can activate an flow, but you couldn't answer to it.
We've three ways to answer in our flows.

> Check answer api here [AnswerAPI docs](./AnswerAPI.md)
```ts
// Using a basic string, you could use memo here
GreetFlow.addAnswer("Hello, how are you!");
// Using the answer api
GreetFlow.addAnswer(MyGreatAnswerHere)
// Use an array for answering, it is the same using answerapi
GreetFlow.addAnswer(["Oh, are you {feel}", "I hope that was a good answer"]);
```

## Attach to Manager
When you've finished your ideal flow, you have need to add it to the Manager, so the method is `Manager->addFlow(flow);`. Here is an example
```ts
Manager.getInstance().addFlow(GreetFlow);
```