# Context API
## Reply & Send
Quick Reply for a message using a simple string or a message of baileys
```ts
    ctx.send(message: string = "Hello World!");
    ctx.reply(message: AnyMessageContent = {
        text: "Hello World!"
    });
```
## sendOtherContact
Same up but with jid field
```ts
    ctx.sendOtherContect(
        jid: string = "1234@xdxd.com", 
        message: string | AnyMessageContent = "Hola Mundo"
    );
```
## useMemo
Make easy to use a RAM based memory for your chats, it supports multi-flow

+ **Example**
    ```js
        ctx.useMemo(ctx.phoneNumber, "name", "jorge");
    ```
- **Declarations**
    ```ts
        ctx.useMemo<MemoType>(jid: string, key: string, value: MemoType): MemoType
    ```

## MemoText
Process and fill with your memos easily.
+ **Exmaple**
    ```js
    ctx.MemoText(ctx.phoneNumber, name);
    ```
+ **Declarations**
    ```ts
    ctx.MemoText(jid: string, key: string)
    ```
This API requires your text formatted with the following format `{variable}` and it will convert it to the memo, if you haven't one you'll recive `Indefinido`.

## delay/delayWithPresence
Those functions are delayers, one is a simple delayer, and the second gives you the opportunity to change the state from `available` to another one
+ **Example**
    ```js
        await ctx.delay(1, Kind.SECONDS);
        await ctx.delayWithPresence('composing', 1, Kind.SECONDS);
    ```

+ **Declarations**
    ```ts
        ctx.delay(time: number, kind: Kind): Promise<void>;
        ctx.delay(presence: WAPresence, time: number, kind: Kind): Promise<void>
    ```
## setPresence
This function gives you the posibility to change your presence on whatsapp for a chat.

```ts
    await ctx.setPresence(presence: WAPresence | 'composing');
```
## moveToFlow
> UNTESTEST - Dont use in production!
This function makes you exit from the current flow and go to another
```js
    const nyNewBrandFlow = new Flow()
    /** more code ***/
    ctx.moveToFlow(myNewBrandFlow);
```


## Variables
+ `SenderInfo: proto.Message.IContactMessage` - Gives you the basic info about your sender.
+ `body: string` - Gives you the message text body.
+ `phoneNumber: string` - Gives you the phone number(jid) of your sender.