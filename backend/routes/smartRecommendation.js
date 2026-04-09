const express = require('express');
const recomRoutes = express.Router();
const { getSmartRecommendations } = require('../controllers/smartRecommendation');

recomRoutes.get('/recommendations/:userId', getSmartRecommendations);


module.exports = recomRoutes