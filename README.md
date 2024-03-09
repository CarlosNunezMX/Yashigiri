# New Flow - Experimental
An new and experimental Conversational Flow for Baileys bots, easy to use and
attach to your bot.

> Fill with your number in white list at `source/Conversation/index.ts` then use
`npm build` and `npm start`

When you've created your socket use `Manager->getInstance().attach(socket)` with this line you've installed your bot in your Baileys Socket, now try to explore the Flows

A small review for the API is here.
# Context API
## Reply & Send
Quick Reply for a message using a simple string or a message of baileys
```js
    ctx.send("Hello World!");
    ctx.reply({
        text: "Hello World!"
    });
```

## useMemo
Make easy to use a RAM based memory for your chats, it supports multi-flow

+ **Example**
    ```js
        ctx.useMemo(ctx.cellPhone, "name", "jorge");
    ```
- **Declarations**
    ```ts
        ctx.useMemo<MemoType>(jid: string, key: string, value: MemoType): MemoType
    ```

## MemoText
Process and fill with your memos easily.
+ **Exmaple**
    ```js
    ctx.MemoText(ctx.cellPhone, name);
    ```
+ **Declarations**
    ```ts
    ctx.MemoText(jid: string, key: string)
    ```
This API requires your text formatted with the following format `{variable}` and it will convert it to the memo, if you haven't one you'll recive `Indefinido`.

and more...