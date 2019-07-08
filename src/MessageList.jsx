import React, {Component} from 'react';
import Message from './Message.jsx';
import Notification from './Notification.jsx';

export default class MessageList extends Component {

  constructor(props){
    super(props);
  }

  render() {
    const localMess = this.props.messages;
    const messages = localMess.map((message) => {

        console.log(message);
        if(message.type === "incomingMessage"){
          return <Message message={message} key={message.id}/>
        }
        else{
          return <Notification message={message} key={message.id}/>
        }
    });

    return (
      <main className="messages"> {messages} </main>
    );
  }
}
