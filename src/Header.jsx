import React, {Component} from 'react';

class App extends Component {
  render() {
    return (
      <nav className="navbar">
        <a className="navbar-brand">Chatty</a>
        <p className='online-users'>Online Now:  {this.props.onlineUsers}</p>
      </nav>
    );
  }
}
export default App;