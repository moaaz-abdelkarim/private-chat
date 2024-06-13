const express = require('express');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/send', authMiddleware, async (req, res) => {
    const { receiver, content } = req.body;
    const sender = req.user.id;
    try {
        const message = await Message.create({ sender, receiver, content });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/history/:userId', authMiddleware, async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    try {
        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ]
        }).sort('createdAt');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
