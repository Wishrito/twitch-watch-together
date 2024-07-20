const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const rooms = {}; // Object to store room information and users

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinRoom', ({ room, username }) => {
        if (!rooms[room]) {
            rooms[room] = { users: [], stream: null };
        }
        rooms[room].users.push(username);
        socket.join(room);
        socket.username = username;
        socket.room = room;

        io.to(room).emit('userList', rooms[room].users);
        if (rooms[room].stream) {
            socket.emit('changeStream', rooms[room].stream);
        }
        console.log(`User ${username} joined room: ${room}`);
    });

    socket.on('changeStream', (data) => {
        rooms[data.room].stream = data.stream;
        io.to(data.room).emit('changeStream', data.stream);
    });

    socket.on('disconnect', () => {
        const room = socket.room;
        const username = socket.username;

        if (room && rooms[room]) {
            rooms[room].users = rooms[room].users.filter(user => user !== username);
            io.to(room).emit('userList', rooms[room].users);

            if (rooms[room].users.length === 0) {
                delete rooms[room];
            }
        }
        console.log(`User ${username} disconnected from room: ${room}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
