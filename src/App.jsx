import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import Header from './Header.jsx';
import MessageList from './MessageList.jsx';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      onlineUser: 0,
      currentUser: {name: "Anonymous" + Math.floor(Math.random()*10000)},
      messages: [
        {
          type: "incomingMessage",
          username: "Chat BOT",
          content: "Welcome to Chatty App! An application that allows user to chat with each other.",
          id: 1
        },
        {
          type: "incomingMessage",
          username: "Chat BOT",
          content: "Your default username is Anonymous. If you wish to change your username, type in your new username in the input box below and press enter!",
          id: 2
        },
        {
          type: "incomingMessage",
          username: "Chat BOT",
          content: "No harrasment and offensive languages are allowed in this chat!",
          id: 3
        }
      ]
    };
  }

  componentDidMount() {
    console.log("Launch componentDidMount");
    this.Socket = new WebSocket("ws://localhost:3001");

    this.Socket.onopen = (event) => {


      console.log('connected to the server');

      this.Socket.onmessage = (event) => {

        console.log('online users: ', JSON.parse(event.data).onlineUser);
        this.setState({onlineUser: JSON.parse(event.data).onlineUser});

        const newMessage = JSON.parse(event.data);
        console.log('receive new message from server', newMessage);
        const messages = this.state.messages.concat(newMessage);
        this.setState({messages: messages});
      }
    };
    /*setTimeout(() => {
      console.log("Simulating incoming message");
      // Add a new message to the list of messages in the data store
      const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
      const messages = this.state.messages.concat(newMessage)
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({messages: messages})
    }, 1000);*/
  }

  handleNewMessage = (event) => {
    if(event.key === 'Enter'){
      if(event.target.value!== null && event.target.value!== ""){

        //offensive language filter
        if(event.target.value.includes('fuck')){
          event.target.value = event.target.value.replace('fuck', "f**k");
        }

        var newMessage = {
          type: 'postMessage',
          username: this.state.currentUser.name,
          content: event.target.value
        };
        console.log('ENTER PRESSED, MESSAGE: ', newMessage);

        this.Socket.send(JSON.stringify(newMessage));
        console.log('message sent to server');
        //const messages = this.state.messages.concat(newMessage);
        //this.setState({messages: messages})
      }
      else{
        alert('Message cannot be empty!');
      }
    }
  }

  handleUsername = (event) => {
    if(event.key === 'Enter'){
      if(event.target.value.trim()!== '' && event.target.value!== this.state.currentUser.name){
        const originalUsername = this.state.currentUser.name;
        this.setState({currentUser: {name: event.target.value}});
        var newMessage = {
          type: 'postNotification',
          username: originalUsername,
          content: event.target.value
        };
        console.log('ENTER PRESSED, NOTIFICATION: ', newMessage);

        this.Socket.send(JSON.stringify(newMessage));
        console.log('notification sent to server');
      }
    }
  }


  render() {
    return (
      <div>
        <Header onlineUsers={this.state.onlineUser}/>
        <MessageList messages={this.state.messages} user={this.state.currentUser.name}/>
        <ChatBar user={this.state.currentUser.name} composeMessage={this.handleNewMessage} changeUsername={this.handleUsername}/>
      </div>
    );
  }
}
export default App;
