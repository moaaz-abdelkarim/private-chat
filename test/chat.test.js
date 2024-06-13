const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');  // Adjust the path to your server file
const User = require('../models/User');
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Chat API', () => {
    let token;
    let userId;

    before(async () => {
        await User.deleteMany({});
        await Message.deleteMany({});
        
        const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password' });
        userId = user._id;
        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    });

    describe('POST /api/chat/send', () => {
        it('should send a private message', (done) => {
            chai.request(app)
                .post('/api/chat/send')
                .set('Authorization', `Bearer ${token}`)
                .send({ receiver: userId, content: 'Hello!' })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('content').eql('Hello!');
                    done();
                });
        });
    });

    describe('GET /api/chat/history/:userId', () => {
        it('should get chat history with a user', (done) => {
            chai.request(app)
                .get(`/api/chat/history/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });
});
