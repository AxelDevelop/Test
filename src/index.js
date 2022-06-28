const socket = io('http://localhost:3000');

const messageform = document.querySelector(".chatbox form")
const messageList = document.querySelector("#messagelist")
const userList = document.querySelector("#users")
const chatboxInput = document.querySelector("#inputtext")
const userAddForm = document.querySelector('.modal'),
    backdrop = document.querySelector('.backdrop'),
    userAddImput = document.querySelector('.modal input');
<<<<<<< HEAD
=======

>>>>>>> 2db03d9c7eb86e598b9a47e85667750d08b3fd8c

let messages = [];
let users = [];

// Socket Listeners

socket.on("message_client", (message) => {
    messages.push(message);
    updateMessages();
})

socket.on("users", (_users) => {
    users = _users;
    updateUser();
})

// Event Listeners

messageform.addEventListener("submit", messageSubmitHandler);

userAddForm.addEventListener("submit", userAddHandler);

// Handlres

function messageSubmitHandler(e) {
    e.preventDefault();
    let message = chatboxInput.value;

    if (!message) {
        return alert('El mensaje no se ha enviado');
    }

    socket.emit("message", message);

    chatboxInput.value = "";
}

function updateMessages() {
    messageList.innerHTML = "";

    messages.forEach(data => {
        messageList.innerHTML += `<li>
        <p>${data.user}</p>
        <p>${data.data}</p>
    </li>`
    })
}

function userAddHandler(e) {
    e.preventDefault();
    let userName = userAddImput.value;

    if (!userName) {
        alert('You Must add an user name');
    }

    socket.emit("addUser", userName);

    userAddForm.classList.add('disappear');
    backdrop.classList.add('disappear');

}

function updateUser() {
    userList.textContent = "";

    users.forEach(user => {
        let node = document.createElement("LI");
        let textNode = document.createTextNode(user);
        node.appendChild(textNode);
        userList.appendChild(node);
    })
}