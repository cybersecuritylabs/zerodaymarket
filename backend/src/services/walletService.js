const { Wallet, Transaction, sequelize } = require('../models');

const INITIAL_BALANCE = parseFloat(process.env.INITIAL_WALLET_BALANCE) || 50.00;

class WalletService {
  /**
   * Create a new wallet for a user with the initial balance.
   */
  async createWallet(userId, transaction = null) {
    const wallet = await Wallet.create(
      { userId, balance: INITIAL_BALANCE },
      { transaction }
    );

    // Record the initial credit transaction
    await Transaction.create({
      walletId: wallet.id,
      type: 'credit',
      amount: INITIAL_BALANCE,
      description: 'Welcome bonus — initial wallet balance',
      referenceType: 'signup_bonus',
      referenceId: wallet.id,
      balanceAfter: INITIAL_BALANCE
    }, { transaction });

    return wallet;
  }

  /**
   * Retrieve the current wallet balance for a user.
   */
  async getBalance(userId) {
    const wallet = await Wallet.findOne({ where: { userId } });
    if (!wallet) throw new Error('Wallet not found');
    return parseFloat(wallet.balance);
  }

  /**
   * Credit funds to a user's wallet.
   * Uses a database transaction to prevent race conditions.
   */
  async credit(userId, amount, description, referenceType, referenceId) {
    const t = await sequelize.transaction();
    try {
      const wallet = await Wallet.findOne({
        where: { userId },
        lock: t.LOCK.UPDATE,
        transaction: t
      });
      if (!wallet) throw new Error('Wallet not found');

      const parsedAmount = parseFloat(amount);
      const newBalance = parseFloat(wallet.balance) + parsedAmount;

      wallet.balance = newBalance;
      await wallet.save({ transaction: t });

      await Transaction.create({
        walletId: wallet.id,
        type: 'credit',
        amount: parsedAmount,
        description,
        referenceType,
        referenceId,
        balanceAfter: newBalance
      }, { transaction: t });

      await t.commit();
      return { balance: newBalance };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  /**
   * Debit funds from a user's wallet.
   * Validates sufficient balance before processing.
   * Uses a database transaction to prevent race conditions.
   */
  async debit(userId, amount, description, referenceType, referenceId) {
    const t = await sequelize.transaction();
    try {
      const wallet = await Wallet.findOne({
        where: { userId },
        lock: t.LOCK.UPDATE,
        transaction: t
      });
      if (!wallet) throw new Error('Wallet not found');

      const parsedAmount = parseFloat(amount);
      const currentBalance = parseFloat(wallet.balance);

      if (currentBalance < parsedAmount) {
        throw new Error('Insufficient wallet balance');
      }

      const newBalance = currentBalance - parsedAmount;

      wallet.balance = newBalance;
      await wallet.save({ transaction: t });

      await Transaction.create({
        walletId: wallet.id,
        type: 'debit',
        amount: parsedAmount,
        description,
        referenceType,
        referenceId,
        balanceAfter: newBalance
      }, { transaction: t });

      await t.commit();
      return { balance: newBalance };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  /**
   * Retrieve paginated transaction history for a user.
   */
  async getTransactions(userId, page = 1, limit = 20) {
    const wallet = await Wallet.findOne({ where: { userId } });
    if (!wallet) throw new Error('Wallet not found');

    const offset = (page - 1) * limit;
    const { count, rows } = await Transaction.findAndCountAll({
      where: { walletId: wallet.id },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      transactions: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  }
}

module.exports = new WalletService();
