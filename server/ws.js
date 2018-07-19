const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const WebSocket = require('ws');
const express = require('express');

const app = express()
//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({
    port: 8080,
    perMessageDeflate: {
      zlibDeflateOptions: { // See zlib defaults.
        chunkSize: 1024,
        memLevel: 7,
        level: 3,
      },
      zlibInflateOptions: {
        chunkSize: 10 * 1024
      },
      // Other options settable:
      clientNoContextTakeover: true, // Defaults to negotiated value.
      serverNoContextTakeover: true, // Defaults to negotiated value.
      clientMaxWindowBits: 10,       // Defaults to negotiated value.
      serverMaxWindowBits: 10,       // Defaults to negotiated value.
      // Below options specified as default values.
      concurrencyLimit: 10,          // Limits zlib concurrency for perf.
      threshold: 1024,               // Size (in bytes) below which messages
                                     // should not be compressed.
    }
});


const messageWrap = m => `*${m.replace(/\n|\r|\*/g, "")}*\n`;

wss.on('connection', (ws) => {
    //send immediatly a feedback to the incoming connection    
    let intervalID = setInterval(() => {
        let message = messageWrap("CAPULLO");
        console.log(message)
        ws.send(message);
    },500) 
    ws.on('close',() => {
        console.log("Closed connection");
        clearInterval(intervalID)
    })
});

//start our server
server.listen(process.env.PORT, () => {
    console.log(`Puterizer ready on port ${server.address().port} :)`);
});   