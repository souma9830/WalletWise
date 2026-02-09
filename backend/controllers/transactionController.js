const Transaction = require('../models/Transactions');

// Add Transaction
const addTransaction = async (req, res) => {
    try {
        const userId = req.userId;
        const { type, amount, category, description, paymentMethod, mood, date } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        if (!type || amount === undefined || amount === null || !category) {
            return res.status(400).json({
                success: false,
                message: 'Type, amount, and category are required'
            });
        }

        const numericAmount = Number(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be a valid number greater than 0'
            });
        }

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Type must be either income or expense'
            });
        }

        const transaction = new Transaction({
            userId,
            type,
            amount: numericAmount,
            category: typeof category === 'string' ? category.trim().toLowerCase() : category,
            description: typeof description === 'string' ? description.trim() : description,
            paymentMethod: paymentMethod || 'cash',
            mood: mood || 'neutral',
            ...(date ? { date } : {})
        });

        await transaction.save();

        res.status(201).json({
            success: true,
            message: 'Transaction added successfully',
            transaction: {
                id: transaction._id,
                type: transaction.type,
                amount: transaction.amount,
                category: transaction.category,
                description: transaction.description,
                date: transaction.date,
                paymentMethod: transaction.paymentMethod,
                mood: transaction.mood
            }
        });

    } catch (error) {
        console.error('Add transaction error:', error);

        if (error?.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors || {}).map((e) => ({
                    field: e?.path,
                    message: e?.message
                }))
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error adding transaction'
        });
    }
};

// Get all transactions
const getAllTransactions = async (req, res) => {
    try {
        const userId = req.userId;
        const transactions = await Transaction.find({ userId })
            .sort({ date: -1 });

        res.json({
            success: true,
            transactions: transactions.map(t => ({
                id: t._id,
                type: t.type,
                amount: t.amount,
                category: t.category,
                description: t.description,
                date: t.date,
                paymentMethod: t.paymentMethod,
                mood: t.mood
            }))
        });

    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching transactions'
        });
    }
};

module.exports = {
    addTransaction,
    getAllTransactions
};
