const socket = io('http://localhost:3000');


const messageform = document.querySelector(".chatbox form")
const messageList = document.querySelector(".messageList")
const userList = document.querySelector("ul#users")
const chatboxInput = document.querySelector("#inputText")

const messages = [];

// Socket Listeners

socket.on("message_client", (message) => {
    messages.push(message)
    updateMessages();
})

// Event Listeners

messageform.addEventListener("submit", messageSumitHandler)

function messageSumitHandler(e) {
    e.preventDefault();
    let message = chatboxInput.value;

    if(!message){
        return alert('El mensaje no se ha enviado');
    }

    socket.emit("message", message);

    chatboxInput.value = "";
}


function updateMessages(){
    messageList.textContent = "";
    for (const i of messages.length) {
        messageList.innerHTML += `<li>
            <p>${messages[i].message}</p>
        </li>`
    }
}