import React, {Component} from 'react';

export default class Notification extends Component {

  constructor(props){
    super(props);
  }

  render () {
    return (
        <div className="notification">{this.props.message.content}</div>
    )
  }
}
