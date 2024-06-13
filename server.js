require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(bodyParser.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));

// Serve static files from the public directory
app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
    console.log('A user connected');

    socket.on('join', room => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('private message', ({ content, to }) => {
        io.to(to).emit('private message', { content, from: socket.id });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
