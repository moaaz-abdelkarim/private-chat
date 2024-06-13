import { expect } from 'chai';
import { describe, before, after, it } from 'mocha';
import server from '../server.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

describe('Auth API', () => {
    before(async () => {
        // Connect to the test database
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        // Clean the database before running tests
        await User.deleteMany({});
    });

    after(async () => {
        // Clean the database after running tests
        await User.deleteMany({});
        // Close the database connection
        await mongoose.connection.close();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await chai.request(server)
                .post('/api/auth/register')
                .send({ username: 'testuser', email: 'test@example.com', password: 'password' });

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message').eql('User registered successfully');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login an existing user', async () => {
            const res = await chai.request(server)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'password' });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('token');
        });

        it('should not login with incorrect password', async () => {
            const res = await chai.request(server)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'wrongpassword' });

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
        });
    });
});
