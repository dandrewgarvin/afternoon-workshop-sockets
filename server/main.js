const express = require('express')
    , bodyParser = require('body-parser')
    , socket = require('socket.io')
    , port = 3005

const app = express()

app.use(bodyParser.json())

// ===== SOCKET.IO FROM HERE ON OUT ===== //

const io = socket(app.listen(port, _=> console.log(`listening on port ${port}`)));

// ===== This is where all of our socket 'endpoints' are going to be ===== //

io.on('connection', socket => {
    
    // sends to just the original sender
    socket.on('emit message', input => {
        socket.emit('generate response', input)
    })

    // sends to everyone but original sender
    socket.on('broadcast message', input => {
        socket.broadcast.emit('generate response', input)
    })

    socket.on('blast message', input => {
        io.sockets.emit('generate response', input)
    })

    // joins the specified room
    socket.on('join room', input => {
        socket.join(input.path.split('/')[1])
    })
})