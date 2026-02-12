const { LabCompletion, Notification } = require('../models');

const INITIAL_BALANCE = parseFloat(process.env.INITIAL_WALLET_BALANCE) || 50.00;

class LabService {
  /**
   * Evaluate whether the user has achieved the lab objective.
   * Records progress and triggers appropriate notifications.
   */
  async checkCompletion(userId, currentBalance) {
    if (currentBalance <= INITIAL_BALANCE) return;

    // Already completed — skip
    const existing = await LabCompletion.findOne({ where: { userId } });
    if (existing) return;

    // Record achievement
    await LabCompletion.create({
      userId,
      walletBalance: currentBalance,
      method: 'balance_exceeded_initial',
      completedAt: new Date()
    });

    // Issue system notification
    await Notification.create({
      userId,
      type: 'system_alert',
      title: 'Achievement Unlocked',
      message: 'Congratulations! You have successfully exploited a critical business logic flaw in ZeroDay Market.',
      metadata: {
        category: 'security_achievement',
        currentBalance,
        initialBalance: INITIAL_BALANCE
      }
    });

    console.log(`[Lab] User ${userId} completed the lab. Balance: $${currentBalance}`);
  }

  /**
   * Check if a user has completed the lab.
   */
  async isCompleted(userId) {
    const record = await LabCompletion.findOne({ where: { userId } });
    return record ? { completed: true, completedAt: record.completedAt } : { completed: false };
  }
}

module.exports = new LabService();
