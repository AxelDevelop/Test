const express = require('express');
const Socket = require('socket.io');
const configDB = require('./configDB');
const Msg = require('../models/messages');
const app = express();
const server = require('http').createServer(app);

const io = Socket(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})

configDB.connectDB;


let PORT = 3000;
let users = [];

server.listen(PORT, () => {
    console.log("Listening in Port:", PORT);
})

// Controllers

io.on("connection", (socket) => {
    Msg.find().then(result => {
        socket.emit('msgsUpdate', result)

    })
    console.log("connection on", socket.id);

    socket.on('addUser', (userName) => {
        socket.user = userName;
        users.push(userName);
        io.sockets.emit('users', users);
    })

    socket.on("message", (data) => {

        io.emit("message_client", {
            data,
            user: socket.user
        })
        const message = new Msg({ data, user: socket.user });
        message.save().then(() => {
            io.emit('message', data)
            console.log('Send');
        })
    })

    socket.on('disconnect', () => {
        console.log("We are disconnecting", socket.user);

        if (socket.user) {
            users.splice(users.indexOf(socket.user), 1);
            io.sockets.emit("users", users);
            console.log('remaining users:', users);
        }
    })

    socket.on('deleteMessages', (payload) => {
        io.emit("message_delete", payload)

        Msg.deleteOne({user: payload.user}, (err) => {
            if(err)return handleError(err);
            console.log('Delete', payload.user);
        })
    })

})