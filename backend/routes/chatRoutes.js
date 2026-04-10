const express = require('express');
const chatRoutes = express.Router();
const chatController = require('../controllers/chatController');

// Chat endpoint (Public, does not strictly require auth for the storefront pop-up)
chatRoutes.post('/chat', chatController.handleChat);

module.exports = chatRoutes;
