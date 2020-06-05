'use strict'



let stompClient;
let username;

const randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);

const connect = (event) => {
    document.querySelector(".horizontal").remove();
    username = document.querySelector('#username').value.trim();

    if (username) {
        const login = document.querySelector('#login');
        login.classList.add('hide');

        const chatPage = document.querySelector('#chat-page');
        chatPage.classList.remove('hide');

        const socket = new SockJS('/chat-example');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

const onConnected = () => {
    stompClient.subscribe('/topic/public', onMessageReceived);
    stompClient.send("/app/chat.newUser",
        {},
        JSON.stringify({sender: username, type: 'CONNECT'})
    );
    const status = document.querySelector('#status');
    status.className = 'hide';
}

const onError = (error) => {
    const status = document.querySelector('#status');
    status.innerHTML = 'Could not find the connection you were looking for.';
    status.style.color = 'red';
}

const sendMessage = (event) => {
    const messageInput = document.querySelector('#message');
    const messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        const chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT',
            time: moment().calendar(),
            color: randomColor
        }
        stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}


const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);

    const chatCard = document.createElement('div');
    chatCard.className = 'card-body';

    const flexBox = document.createElement('div');
    flexBox.className = 'd-flex justify-content-end mb-4 m-3';
    chatCard.appendChild(flexBox);

    const messageElement = document.createElement('div');
    messageElement.className = 'msg_container_send';

    flexBox.appendChild(messageElement);

    if (message.type === 'CONNECT') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' connected!';
    } else if (message.type === 'DISCONNECT') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        const avatarContainer = document.createElement('div');
        avatarContainer.className = 'img_cont_msg';
        const avatarElement = document.createElement('div');
        avatarElement.className = 'circle';
        const avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = message.color;
        avatarContainer.appendChild(avatarElement);

        messageElement.style['background-color'] = message.color;

        flexBox.appendChild(avatarContainer);

        const time = document.createElement('span')
        time.className = 'msg_time_send'
        time.innerHTML = message.time
        messageElement.appendChild(time)
    }

    messageElement.innerHTML += message.content;

    const chat = document.querySelector('#chat');
    chat.appendChild(flexBox);
    chat.scrollTop = chat.scrollHeight
}

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', connect);
const messageControls = document.querySelector('#message-controls');
messageControls.addEventListener('submit', sendMessage);
