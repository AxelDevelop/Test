const socket = io('http://localhost:3000');


const messageform = document.querySelector(".chatbox form")
const messageList = document.querySelector("#messagelist")
const userList = document.querySelector("#users")
const chatboxInput = document.querySelector("#inputtext")
const userAddForm = document.querySelector('.modal'),
    backdrop = document.querySelector('.backdrop'),
    userAddImput = document.querySelector('.modal input');

let messages = [];
let users = [];

// Socket Listeners

socket.on("message_client", (message) => {
    messages.push(message);
    updateMessages();
    console.log(messages);
})

socket.on("users", (_users) => {
    users = _users;
    updateUsers();
})

// Event Listeners

messageform.addEventListener("submit", messageSubmitHandler);

userAddForm.addEventListener("submit", userAddHandler);

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

    for (let i = 0; i <= messages.length; i++) {
        messageList.innerHTML += `<li>
            <p>${messages[i].data}</p>
        </li>`
    }
}

function userAddHandler(e) {
    e.preventDefault();

    let userName = userAddImput.value;

    if (!userName) {
        alert('You Must add an user name');
    }

    socket.emit("addUser", userName);

    userAddForm.classList.add('dissapear');
    backdrop.classList.add('dissapear');

}

function updateUser() {
    userList.textContent = "";

    for (let i of users.length) {
        let node = document.createElement("li");
        let textNode = document.createElement(users[i]);
        node.appendChild(textNode);
        userList.appendChild(node);
    }
}