import React, { Component } from 'react';
import './App.css';

import io from 'socket.io-client';
const socket = io();

class App extends Component {

  constructor(){
    super()

    this.state = {
      rooms: [
        {
          name: 'General', 
          path: '/',
          messages: [],
          connected: true
        },
        {
          name: 'Private', 
          path: '/private',
          messages: [],
          connected: false
        },
        {
          name: 'Admin', 
          path: '/admin',
          messages: [],
          connected: false
        }
      ],
      message: ''
    }
    this.changeMessage = this.changeMessage.bind(this)
    this.joinRoom = this.joinRoom.bind(this)


    socket.on('generate response', (data) => {
      let roomArr = this.state.rooms
      roomArr[data.ind].messages.push(data.message)
      this.setState({ rooms: roomArr })
    })
  }

  sendMessage(ind, path, type) {
    socket.emit(`${type} message`, { room: path, message: this.state.message, ind } )
    this.setState({ message: '' })
  }

  joinRoom(ind, path){
    socket.emit('join room', { path })
    let tempRooms = this.state.rooms
    tempRooms[ind].connected = true
    this.setState({ 
      rooms: tempRooms
    })
  }

  changeMessage(e) {
    this.setState({ message: e })
  }

  render() {

    const joinedRooms = this.state.rooms.map( (e,i,a) => {
      if (e.connected) {
        return ( 
          <section className="room_card" key={i}>
            <h1>{ e.name }</h1>
            <div className="message_board">
              { e.messages.map( (el, ind) => <p key={ind}> { el } </p> ) }
            </div>
            <div className="send_container">
              <button className="send_button" onClick={ev => this.sendMessage(i, e.path, 'emit')}>Emit Message</button>
              <button className="send_button" onClick={ev => this.sendMessage(i, e.path, 'broadcast')}>Broadcast Message</button>
              <button className="send_button" onClick={ev => this.sendMessage(i, e.path, 'blast')}>Blast Message</button>
            </div>
          </section>
        )
      } else {
        return (
          <section className="room_card">
            <h1> { e.name } </h1>
            <h4>Not Connected</h4>
            <button onClick={ evnt => this.joinRoom(i, e.path) }>Join Channel</button>
          </section>
        )
      }
    })

    return (
      <div className="App">

        {joinedRooms}

        <input className="input_field" type="text" placeholder="Type message..." onChange={ _=> this.setState({ message: _.target.value }) } value={this.state.message}/>

      </div>
    );
  }
}

export default App;
