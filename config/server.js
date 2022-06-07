const express = require('express');
const Socket = require('socket.io');
const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://Admin:1234@cluster0.fukdn.mongodb.net/?retryWrites=true&w=majority'

const app = express();
const server = require('http').createServer(app);

connectDB();

const io = Socket(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})

let PORT = 3000;
let users = [];

server.listen(PORT, () => {
    console.log("Listening in Port:", PORT);
})

io.on("connection", (socket) => {
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
    })

    socket.on('disconnect', () => {
        console.log("We are disconnecting", socket.user);

        if (socket.user) {
            users.splice(users.indexOf(socket.user), 1);
            io.sockets.emit("users", users);
            console.log('remaining users:', users);
        }
    })

})

async function connectDB() {
    try {
        await mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
        console.log('Succesfull Database Connection');
    } catch (error) {
        console.log(error);
    }
}