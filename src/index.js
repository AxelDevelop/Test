
const socket = io('http://localhost:3000');

const messageform = document.querySelector(".chatbox form")
const messageList = document.querySelector("#messagelist")
const userList = document.querySelector("#users")
const chatboxInput = document.querySelector("#inputtext")
const userAddForm = document.querySelector('.modal'),
    backdrop = document.querySelector('.backdrop'),
    userAddImput = document.querySelector('.modal input');
const formDelete = document.querySelector('#delete');
const userDelete = document.querySelector('#username');
const desciptionDelete = document.querySelector('#description');

let messages = [];
let users = [];

// Socket Listeners

socket.on("message_client", (message) => {
    console.log(message);
    messages.push(message);
    updateMessages();
})

socket.on("message_delete", (payload) => {
    console.log(payload);
    updateMessages();
})

socket.on("users", (_users) => {
    users = _users;
    updateUser();
})

socket.on('msgsUpdate', (data) => {
    if (data.length) {
        data.forEach(msg => {
            let users = msg.user;
            let msgs = msg.data
            getMessages(users, msgs);
        })
    }
})

// Event Listeners

messageform.addEventListener("submit", messageSubmitHandler);

userAddForm.addEventListener("submit", userAddHandler);

formDelete.addEventListener('submit', deleteCollection);



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

function getMessages(user, message) {
    const html = `<p class="font-bold capitalize ">${user}</p>
         <p class="capitalize ">${message}</p>
     </li>`
    messageList.innerHTML += html;

}

function updateMessages() {
    // messageList.innerHTML = ""

    messages.forEach(msg => {
        messageList.innerHTML +=
        `<p class="font-bold capitalize ">${msg.user}</p>
         <p class="capitalize ">${msg.data}</p>
     </li>`
    })

}

function userAddHandler(e) {
    e.preventDefault();
    let userName = userAddImput.value;

    if (!userName) {
        alert('You Must add an user name');
        userName = "!UNR!"
    }

    socket.emit("addUser", userName);

    userAddForm.classList.add('disappear');
    backdrop.classList.add('disappear');

}

function updateUser() {
    userList.textContent = "";

    users.forEach(user => {
        let node = document.createElement("LI");
        node.classList.add('text-semibold', 'p-1', 'capitalize');
        let textNode = document.createTextNode(user);
        node.appendChild(textNode);
        userList.appendChild(node);
    })
}

function deleteCollection (e) {
    e.preventDefault();
    let userData = {
        user: userDelete.value,
        description: desciptionDelete.value
    }

    if(!userData.user && !userData.description){
        console.log('You need an user and description for delete one message');
    }else{
        socket.emit("deleteMessages", userData);
        console.log(userData);
    }
    userData.user = "";
    userData.description = "";
    
}