const { body, param, validationResult } = require('express-validator');

/**
 * Handle validation errors from express-validator.
 * Returns 400 with structured error messages.
 */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
}

/* ────────────── Validation Rule Sets ────────────── */

const registerRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email address is required'),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  handleValidation
];

const loginRules = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email address is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidation
];

const checkoutRules = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.productId')
    .isUUID()
    .withMessage('Valid product ID is required'),
  body('items.*.quantity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10'),
  body('couponCode')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Invalid coupon code format'),
  handleValidation
];

const refundRules = [
  param('orderId')
    .isUUID()
    .withMessage('Valid order ID is required'),
  handleValidation
];

const couponApplyRules = [
  body('code')
    .trim()
    .notEmpty()
    .isLength({ max: 50 })
    .withMessage('Valid coupon code is required'),
  handleValidation
];

const profileUpdateRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  handleValidation
];

const searchRules = [
  body('query')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Search query too long'),
  handleValidation
];

module.exports = {
  registerRules,
  loginRules,
  checkoutRules,
  refundRules,
  couponApplyRules,
  profileUpdateRules,
  searchRules,
  handleValidation
};
