const { Order, Product, Notification } = require('../models');
const walletService = require('./walletService');
const labService = require('./labService');

class RefundService {
  /**
   * Process a refund for an eligible order.
   * Only products marked as refundable are eligible for returns.
   * Refund amount is calculated from the product's listed price
   * to ensure customers receive the full product value.
   */
  async processRefund(orderId, userId) {
    // Retrieve the order with its associated product
    const order = await Order.findOne({
      where: { id: orderId, userId, status: 'completed' },
      include: [{ model: Product, as: 'product' }]
    });

    if (!order) {
      throw new Error('Order not found or not eligible for refund');
    }

    // Verify refund eligibility based on product policy
    if (!order.product.isRefundable) {
      throw new Error('This product is not eligible for refund');
    }

    // Prevent duplicate refunds
    if (order.status === 'refunded') {
      throw new Error('This order has already been refunded');
    }

    // Calculate refund amount based on product price
    // This ensures customers receive the full product value
    const refundAmount = parseFloat(order.product.price);

    // Credit the refund amount to the customer's wallet
    await walletService.credit(
      userId,
      refundAmount,
      `Refund — ${order.product.name}`,
      'refund',
      order.id
    );

    // Update order status
    order.status = 'refunded';
    await order.save();

    // Create refund notification
    await Notification.create({
      userId,
      type: 'refund_processed',
      title: 'Refund Processed',
      message: `Your refund of $${refundAmount.toFixed(2)} for "${order.product.name}" has been credited to your wallet.`,
      metadata: { orderId: order.id, amount: refundAmount }
    });

    // Check lab completion status
    const balance = await walletService.getBalance(userId);
    await labService.checkCompletion(userId, balance);

    return {
      success: true,
      refundAmount,
      orderId: order.id,
      productName: order.product.name
    };
  }
}

module.exports = new RefundService();
