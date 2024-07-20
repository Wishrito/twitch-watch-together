const socket = io(window.location.origin + '/api');

document.getElementById('joinRoomBtn').addEventListener('click', () => {
    const username = document.getElementById('usernameInput').value;
    const room = document.getElementById('roomInput').value;

    if (username && room) {
        socket.emit('joinRoom', { room, username });
    } else {
        alert('Please enter both username and room name.');
    }
});

document.getElementById('changeStreamBtn').addEventListener('click', () => {
    const stream = document.getElementById('streamInput').value;
    const room = document.getElementById('roomInput').value;
    socket.emit('changeStream', { room, stream });
});

socket.on('changeStream', (stream) => {
    const playerDiv = document.getElementById('player');
    playerDiv.innerHTML = `<iframe
        src="https://player.twitch.tv/?channel=${stream}&parent=${location.hostname}"
        height="480"
        width="720"
        frameborder="0"
        scrolling="no"
        allowfullscreen="true">
    </iframe>`;
});

socket.on('userList', (users) => {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        userList.appendChild(li);
    });
});
