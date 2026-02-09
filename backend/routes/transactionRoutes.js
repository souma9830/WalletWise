const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { transactionSchema } = require('../utils/validationSchemas');
const transactionController = require('../controllers/transactionController');

// Add transaction (both income and expense)
router.post('/', protect, validate(transactionSchema), transactionController.addTransaction);

// Get all transactions
router.get('/', protect, transactionController.getAllTransactions);

module.exports = router;
