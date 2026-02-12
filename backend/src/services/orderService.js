const { Order, Product, Coupon, sequelize } = require('../models');
const walletService = require('./walletService');
const couponService = require('./couponService');
const cashbackService = require('./cashbackService');

class OrderService {
  /**
   * Process checkout for a list of items.
   * Validates products, applies coupons, deducts wallet, and creates orders.
   */
  async checkout(userId, items, couponCode = null) {
    // Validate and fetch all products
    const productIds = items.map(i => i.productId);
    const products = await Product.findAll({ where: { id: productIds } });

    if (products.length !== productIds.length) {
      throw new Error('One or more products not found');
    }

    // Check stock availability
    for (const product of products) {
      const item = items.find(i => i.productId === product.id);
      const qty = item.quantity || 1;
      if (product.stock < qty) {
        throw new Error(`Insufficient stock for "${product.name}"`);
      }
    }

    // Process coupon if provided
    let coupon = null;
    let totalDiscount = 0;

    if (couponCode) {
      coupon = await couponService.validate(couponCode, userId);
      totalDiscount = parseFloat(coupon.discountAmount);
    }

    // Calculate item costs and apply discount
    const orderItems = [];
    let discountRemaining = totalDiscount;

    // Sort by price descending so discount applies to the most expensive eligible item
    const sortedProducts = [...products].sort((a, b) =>
      parseFloat(b.price) - parseFloat(a.price)
    );

    for (const product of sortedProducts) {
      const item = items.find(i => i.productId === product.id);
      const qty = item.quantity || 1;
      const itemPrice = parseFloat(product.price) * qty;

      // Apply remaining discount to this item
      const itemDiscount = Math.min(discountRemaining, itemPrice);
      discountRemaining -= itemDiscount;

      const amountPaid = itemPrice - itemDiscount;

      orderItems.push({
        productId: product.id,
        product,
        quantity: qty,
        originalPrice: parseFloat(product.price),
        discountApplied: itemDiscount,
        amountPaid,
        couponId: itemDiscount > 0 && coupon ? coupon.id : null
      });
    }

    // Calculate grand total
    const grandTotal = orderItems.reduce((sum, o) => sum + o.amountPaid, 0);

    // Verify wallet balance
    const balance = await walletService.getBalance(userId);
    if (balance < grandTotal) {
      throw new Error('Insufficient wallet balance');
    }

    // Execute checkout within a transaction
    const t = await sequelize.transaction();
    try {
      // Create orders
      const createdOrders = [];
      for (const orderItem of orderItems) {
        const order = await Order.create({
          userId,
          productId: orderItem.productId,
          quantity: orderItem.quantity,
          originalPrice: orderItem.originalPrice,
          discountApplied: orderItem.discountApplied,
          amountPaid: orderItem.amountPaid,
          couponId: orderItem.couponId,
          status: 'completed'
        }, { transaction: t });

        createdOrders.push(order);

        // Decrement stock
        await Product.update(
          { stock: sequelize.literal(`stock - ${orderItem.quantity}`) },
          { where: { id: orderItem.productId }, transaction: t }
        );
      }

      // Mark coupon as used
      if (coupon) {
        await couponService.markUsed(coupon.id, t);
      }

      await t.commit();

      // Debit wallet (outside transaction as wallet has its own locking)
      await walletService.debit(
        userId,
        grandTotal,
        `Purchase — ${orderItems.map(o => o.product.name).join(', ')}`,
        'purchase',
        createdOrders[0].id
      );

      // Check for cashback eligibility (asynchronously)
      for (const orderItem of orderItems) {
        if (parseFloat(orderItem.originalPrice) === 30.00) {
          cashbackService.processCashback(userId, orderItem.productId);
        }
      }

      // Fetch complete orders with product details
      const fullOrders = await Order.findAll({
        where: { id: createdOrders.map(o => o.id) },
        include: [{ model: Product, as: 'product' }]
      });

      return { orders: fullOrders, totalPaid: grandTotal };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  /**
   * Retrieve all orders for a user.
   */
  async getUserOrders(userId) {
    return Order.findAll({
      where: { userId },
      include: [
        { model: Product, as: 'product' },
        { model: Coupon, as: 'coupon', attributes: ['code', 'discountAmount'] }
      ],
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Retrieve a specific order by ID, scoped to the requesting user.
   */
  async getOrderById(orderId, userId) {
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [
        { model: Product, as: 'product' },
        { model: Coupon, as: 'coupon', attributes: ['code', 'discountAmount'] }
      ]
    });
    if (!order) throw new Error('Order not found');
    return order;
  }
}

module.exports = new OrderService();
