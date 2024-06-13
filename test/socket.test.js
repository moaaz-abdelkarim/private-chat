const io = require('socket.io-client');
const server = require('../server');  // Adjust the path to your server file

describe('Socket.IO Chat', () => {
    let clientSocket;

    before((done) => {
        clientSocket = io.connect('http://localhost:3000', {
            'reconnection delay': 0,
            'reopen delay': 0,
            'force new connection': true,
            transports: ['websocket'],
        });
        clientSocket.on('connect', () => {
            done();
        });
    });

    after((done) => {
        if (clientSocket.connected) {
            clientSocket.disconnect();
        }
        done();
    });

    it('should receive a private message', (done) => {
        const testMessage = { content: 'Hello!', to: 'testRoom' };
        
        clientSocket.emit('join', 'testRoom');

        clientSocket.once('private message', (message) => {
            message.should.be.eql(testMessage);
            done();
        });

        clientSocket.emit('private message', testMessage);
    });
});
