import React, {Component} from "react";

function InputBox(props){
  return <footer className="chatbar">
            <input className="chatbar-username" type="text" onKeyUp={props.changeUsername} placeholder="Your Name (Optional)" />
            <input className="chatbar-message" type="text" onKeyUp={props.composeMessage} placeholder = "Type a message and hit ENTER" />
          </footer>
}

export default class Message extends Component {

  constructor(props){
    super(props);
  }

  render(){
    return (
        <InputBox composeMessage={this.props.composeMessage} changeUsername={this.props.changeUsername}/>
    );
  }
}