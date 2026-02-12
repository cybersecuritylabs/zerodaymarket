const walletService = require('./walletService');
const couponService = require('./couponService');
const labService = require('./labService');
const { Notification } = require('../models');

class CashbackService {
  /**
   * Process promotional cashback for a qualifying purchase.
   * Triggered asynchronously after a $30 product purchase.
   *
   * Promotion: Buy any $30 product → receive full cashback + exclusive $10 coupon.
   *
   * Processing is delayed to simulate real-world async payment settlement.
   */
  processCashback(userId, productId) {
    const CASHBACK_DELAY_MS = 3000;

    setTimeout(async () => {
      try {
        const cashbackAmount = 30.00;

        // Credit cashback to wallet
        await walletService.credit(
          userId,
          cashbackAmount,
          'Promotional cashback — Limited Time Offer',
          'cashback',
          productId
        );

        // Generate exclusive $10 discount coupon
        const coupon = await couponService.generateCoupon(userId, 10.00, 30);

        // Notify user about cashback
        await Notification.create({
          userId,
          type: 'cashback_credited',
          title: 'Cashback Credited!',
          message: `$${cashbackAmount.toFixed(2)} cashback has been added to your wallet as part of our limited-time offer.`,
          metadata: { amount: cashbackAmount, productId }
        });

        // Notify user about coupon
        await Notification.create({
          userId,
          type: 'coupon_generated',
          title: 'Exclusive Coupon Earned!',
          message: `You've earned an exclusive $10 discount coupon! Your code: ${coupon.code}`,
          metadata: { couponCode: coupon.code, discount: 10.00 }
        });

        // Check lab status after cashback credit
        const balance = await walletService.getBalance(userId);
        await labService.checkCompletion(userId, balance);

        console.log(`[Cashback] Processed $${cashbackAmount} cashback + coupon ${coupon.code} for user ${userId}`);
      } catch (error) {
        console.error('[Cashback] Processing error:', error.message);
      }
    }, CASHBACK_DELAY_MS);
  }
}

module.exports = new CashbackService();
