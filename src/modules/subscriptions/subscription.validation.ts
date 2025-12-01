import { body } from 'express-validator';

export const subscribeToPlanValidation = [
  body('planId')
    .notEmpty()
    .withMessage('Plan ID is required')
    .isMongoId()
    .withMessage('Invalid plan ID'),
];

export const confirmSubscriptionPaymentValidation = [
  body('paymentIntentId')
    .notEmpty()
    .withMessage('Payment intent ID is required'),
];

export const upsertSubscriptionPlanValidation = [
  body('planId')
    .optional()
    .isMongoId()
    .withMessage('Invalid plan ID'),
  body('name')
    .notEmpty()
    .withMessage('Plan name is required')
    .trim(),
  body('slug')
    .notEmpty()
    .withMessage('Slug is required')
    .trim()
    .customSanitizer(value => value.toLowerCase())
    .isIn(['free', 'pro', 'premium'])
    .withMessage('Slug must be free, pro, or premium'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .toInt()
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 day'),
  body('discountPercentage')
    .notEmpty()
    .withMessage('Discount percentage is required')
    .toFloat()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
];
