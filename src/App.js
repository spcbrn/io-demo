import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
  }

  componentDidMount() {
    this.socket = io('/')
    this.socket.on('message', (message) => {
      this.setState({
        messages: [message, ...this.state.messages]
      })
    })
  }

  handleSubmit = (e) => {
    const body = e.target.value;
    if (e.keyCode === 13 && body) {
      const message = {
        body,
        from: 'me'
      }
      this.setState({
        messages: [message, ...this.state.messages]
      })
      this.socket.emit('message', body);
      e.target.value = '';
    }
  }

  render() {
    const messages = this.state.messages.map((msg, i) => {
      const img = msg.img ? <img alt="su" src={msg.img} width="200px"/> : null;
      return (
        <li key={i}><b>{msg.from}:</b>{msg.body} {img}</li>
      )
    });
    return (
      <div className="App">
        <h1>Hello World!</h1>
        <input type="text"
               placeholder="Enter a message..."
               onKeyUp={this.handleSubmit}
        />
        {messages}
      </div>
    );
  }
}

export default App;
