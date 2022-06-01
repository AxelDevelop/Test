const express = require('express')
const Socket = require('socket.io');

const app = express();
const server = require('http').createServer(app);

const io = Socket(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})

let PORT = 3000;

server.listen(PORT, () => {
    console.log("Listening in Port: ", PORT);
})

io.on("connection", (socket) => {
    console.log("connection on ", socket.io);

    socket.on("ping", (data) => {
        console.log(data, ": from ping event");
    })
})