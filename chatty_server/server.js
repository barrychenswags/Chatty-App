// server.js

const express = require('express');
const SocketServer = require('ws').Server;

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

//function that generate random IDs for messages
function generateRandomID(digits) {
  var chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var randomString = '';
  for (var i = 0; i < digits; i++){
    randomString = randomString + chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return randomString;
}

//initiate online user at 0
var userCounter = 0;

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');

  //increment the user counter by 1 whenever a new user connects to the server
  userCounter++;

  //send online users to all users
  wss.clients.forEach(function each(client) {
    if(client.readyState) {
          client.send(JSON.stringify({onlineUser: userCounter}));
    }
  });

  ws.on('message', (data)=>{

    console.log('Date received: ', JSON.parse(data))

    if(JSON.parse(data).type === 'postMessage'){

      const userMessage =  {
          type:'incomingMessage',
          id: generateRandomID(7),
          username: JSON.parse(data).username,
          content: JSON.parse(data).content,
          onlineUser: userCounter
      };

      console.log(userMessage);

      //send message to all users
      wss.clients.forEach(function each(user) {

        if (user.readyState) {
          user.send(JSON.stringify(userMessage));
        }

      });
    }

    else if(JSON.parse(data).type === 'postNotification'){

      const userNotification =  {
          type:'incomingNotification',
          id: generateRandomID(6),
          username: JSON.parse(data).username,
          content: `${JSON.parse(data).username} changed their username to ${JSON.parse(data).content}`,
          onlineUser: userCounter
      };

      console.log(userNotification);

      //send notification to all users
      wss.clients.forEach(function each(user) {

        if (user.readyState) {
          user.send(JSON.stringify(userNotification));
        }

      });
    }
  })
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    //decrement the user counter by 1 whenever a user disconnects from the server
    userCounter--;

    wss.clients.forEach(function each(client) {
      if(client.readyState) {
            client.send(JSON.stringify({onlineUser: userCounter}));
      }
    });

    console.log('Client disconnected')
  });
});