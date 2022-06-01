console.log('Running');

const socket = io('http://localhost:3000');

socket.emit("ping", {
    message: 'Hi there friend'
})