<center>
    <img scr="https://www.github.com/CarlosNunezMX/Yashigiri/raw/main/docs/Yashigiri.png"/>
    <h1>Yashigiri - Conversational Flows</h1>
</center>

An new and experimental Conversational Flow for Baileys bots, easy to use and
attach to your bot.

## Instalation
> Comming soon to NPM, but by the moment run this
```bash
npm install --save github:CarlosNunezMX/Yashigiri
```

## Manager *class(Singlethon)*

### Get the Instance
For getting the instance of the bot manager you just need to call the method `Manager->getInstance();`. 
```ts
const manager = Manager.getInstance();
```
### Attach
This method lets you, attach your bot to the Baileys Socket.
We recommend attach the bot in when the connection is ready, something like this.
```ts
if (connection === 'open') {
    console.log('opened connection')
    Manager.getInstance().attach(sock);
}
```
### setDelay()
> **Experimental** - Bugs fount, dont use in production!
You could add an delay to answers in `string` or `AnyMessageContent`
```ts
manager.setDelay(1000) // time in miliseconds!
```

### useBlack/WhiteList()
You could use black and white lists, with one simple method.
```ts
const blackList = new BlackKist();
blackList.add("123456789")

// whitelist
const whiteList = new WhiteKist();
whiteList.add("123456789");

manager.useBlackList(blackList);
manager.useWhiteList(whiteList);
```

### useContext()
You could extend your context using this method
***Reference at [ContextAPI](./docs/ContextAPI.md#context-extensions)***
```ts
manager.useContext(MyContextAPI);
```
### addFlow()
Add flows to your manager, this will be given to the analyzer class.
```ts 
const greetFlow = new Flow();
manager.addFlow(greetFlow);
```

A small review for the API is here.
+ [**ContextAPI**](docs/ContextAPI.md) - the context will you get when you handle a message manually.
+ [**FlowAPI**](docs/FlowAPI.md) - The hearth of the project!
+ [**AnswerAPI**](docs/AnswerAPI.md) - Make your responses dynamic

<center> More docs comming soon... | Happy Development <center>
