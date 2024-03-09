import "./Conversations/index.js"

import makeWASocket, { DisconnectReason, useMultiFileAuthState, type WASocket } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import log from '@whiskeysockets/baileys/lib/Utils/logger.js';
import { Manager } from './Flow/Manager.js';


async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('Auth');
    // @ts-ignore
    const sock: WASocket = makeWASocket.default({
        // can provide additional config here
        printQRInTerminal: true,
        auth: state,
        syncFullHistory: false,
        // @ts-ignore
        logger: log.default.child({})
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if (shouldReconnect) {
                connectToWhatsApp()
            }
        } else if (connection === 'open') {
            console.log('opened connection')
            Manager.getInstance().attach(sock);
        }
    })
    sock.ev.on('creds.update', async (creds) => {
        await saveCreds();
    })
}
// run in main file
connectToWhatsApp()