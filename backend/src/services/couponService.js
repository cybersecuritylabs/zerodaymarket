const { Coupon } = require('../models');
const crypto = require('crypto');

class CouponService {
  /**
   * Validate a coupon code for a specific user.
   * Checks existence, ownership, usage status, and expiration.
   */
  async validate(code, userId) {
    const coupon = await Coupon.findOne({
      where: { code: code.trim().toUpperCase() }
    });

    if (!coupon) {
      throw new Error('Invalid coupon code');
    }

    if (coupon.userId !== userId) {
      throw new Error('This coupon is not assigned to your account');
    }

    if (coupon.isUsed) {
      throw new Error('This coupon has already been used');
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      throw new Error('This coupon has expired');
    }

    return coupon;
  }

  /**
   * Mark a coupon as used.
   */
  async markUsed(couponId, transaction = null) {
    await Coupon.update(
      { isUsed: true },
      { where: { id: couponId }, transaction }
    );
  }

  /**
   * Generate a unique coupon code for a user.
   */
  async generateCoupon(userId, discountAmount, daysValid = 30) {
    const code = 'ZDM-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    const expiresAt = new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000);

    const coupon = await Coupon.create({
      code,
      discountAmount,
      userId,
      isUsed: false,
      expiresAt
    });

    return coupon;
  }

  /**
   * Retrieve all coupons for a user.
   */
  async getUserCoupons(userId) {
    return Coupon.findAll({
      where: { userId },
      order: [['created_at', 'DESC']]
    });
  }
}

module.exports = new CouponService();
