const express = require('express');
const { createServer } = require("http")
const { Server } = require('socket.io');
const bcrypt = require('bcrypt')

const app = express();
const httpServer = createServer(app);

const configDB = require('./config/configDB');
const Msg = require('./models/messages');
const { json } = require('express');

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})

app.use(express.static(__dirname + "/src"))
app.set("view engine", "ejs");

configDB.connectDB;

app.use(json());

let PORT = 3000;
let users = [];


app.get('/users', (req, res) => {
    res.json(users)
}),

    app.get('/test', (res, req) => {
        req.render('../src/template.ejs')
    })

app.post('/users', async (req, res) => {

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { name: req.body.name, password: hashedPassword }
        users.push(user);
        res.status(201).send()
    } catch {
        res.status(500).send()
    }

})

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name = req.body.name);
    if (user == null) {
        return res.status(400).send("User Not Found");
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send("Success")
        } else {
            res.send('Not Allowed')
        }
    } catch {
        res.status(500).send()
    }
})

// io.use((socket, next) => {
//     const token = socket.handshake.auth.token
//     if (token == 'abcd') {
//         console.log('Authenticated');
//         next();
//     } else {
//         new Error();
//         console.log('Non Authenticated');
//     }
// })

io.on('connect_error', (err) => {
    console.log(err.message);
})

io.on("connection", (socket) => {

    // Controllers

    Msg.find().then(result => {
        socket.emit('msgsUpdate', result)

    })
    console.log("connection on", socket.id);

    socket.on('addUser', (userName) => {
        socket.user = userName;
        console.log(users);

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
        console.log(payload);
    })

})

httpServer.listen(PORT, () => {
    console.log("Listening in Port:", PORT);
})