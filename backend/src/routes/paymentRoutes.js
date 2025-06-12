const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');

router.post('/subscribe', PaymentController.subscribe);

module.exports = router;
