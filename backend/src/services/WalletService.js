const Wallet = require('../models/wallet');

class WalletService {
  // Initialize Wallet
  async initializeWallet(userId) {
    try {
      const wallet = await Wallet.findOneAndUpdate(
        { userId },
        { 
          userId,
          balance: 0,
          transactions: []
        },
        { 
          new: true,
          upsert: true
        }
      );

      return wallet;
    } catch (error) {
      throw error;
    }
  }

  // Get Wallet Balance
  async getWalletBalance(userId) {
    try {
      const wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        throw new Error('Wallet not found');
      }
      return {
        balance: wallet.balance,
        lastUpdated: wallet.updatedAt
      };
    } catch (error) {
      throw error;
    }
  }

  // Get Transaction History
  async getTransactionHistory(userId, options = {}) {
    try {
      const wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      let transactions = wallet.transactions;

      // Apply filters
      if (options.type) {
        transactions = transactions.filter(t => t.type === options.type);
      }

      if (options.status) {
        transactions = transactions.filter(t => t.status === options.status);
      }

      if (options.startDate && options.endDate) {
        transactions = transactions.filter(t => 
          t.timestamp >= new Date(options.startDate) && 
          t.timestamp <= new Date(options.endDate)
        );
      }

      // Sort transactions
      transactions.sort((a, b) => b.timestamp - a.timestamp);

      // Apply pagination
      const page = options.page || 1;
      const limit = options.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      return {
        transactions: transactions.slice(startIndex, endIndex),
        total: transactions.length,
        page,
        totalPages: Math.ceil(transactions.length / limit)
      };
    } catch (error) {
      throw error;
    }
  }

  // Add Transaction
  async addTransaction(userId, transactionData) {
    try {
      const wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Validate transaction
      const validationResult = this.validateTransaction(transactionData);
      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join(', '));
      }

      // Create transaction
      const transaction = {
        type: transactionData.type,
        amount: transactionData.amount,
        description: transactionData.description,
        razorpayPaymentId: transactionData.razorpayPaymentId,
        razorpayOrderId: transactionData.razorpayOrderId,
        status: 'pending',
        timestamp: new Date()
      };

      // Update wallet balance
      const balanceChange = transactionData.type === 'credit' 
        ? transactionData.amount 
        : -transactionData.amount;

      wallet.balance += balanceChange;
      wallet.transactions.push(transaction);

      await wallet.save();

      return {
        transaction,
        newBalance: wallet.balance
      };
    } catch (error) {
      throw error;
    }
  }

  // Update Transaction Status
  async updateTransactionStatus(userId, transactionId, status) {
    try {
      const wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const transaction = wallet.transactions.id(transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // If transaction is already completed or failed, don't allow status change
      if (transaction.status === 'completed' || transaction.status === 'failed') {
        throw new Error('Cannot update status of completed or failed transaction');
      }

      // Update transaction status
      transaction.status = status;

      // If transaction failed, revert the balance change
      if (status === 'failed' && transaction.status === 'pending') {
        const balanceChange = transaction.type === 'credit' 
          ? -transaction.amount 
          : transaction.amount;
        wallet.balance += balanceChange;
      }

      await wallet.save();

      return {
        transaction,
        newBalance: wallet.balance
      };
    } catch (error) {
      throw error;
    }
  }

  // Validate Transaction
  validateTransaction(transactionData) {
    const errors = [];

    if (!['credit', 'debit'].includes(transactionData.type)) {
      errors.push('Invalid transaction type');
    }

    if (typeof transactionData.amount !== 'number' || transactionData.amount <= 0) {
      errors.push('Invalid transaction amount');
    }

    if (!transactionData.description?.trim()) {
      errors.push('Transaction description is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = new WalletService(); 