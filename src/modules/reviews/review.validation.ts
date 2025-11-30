import { body } from 'express-validator';

export const createReviewValidation = [
  body('eventId')
    .notEmpty()
    .withMessage('Event ID is required')
    .isMongoId()
    .withMessage('Invalid event ID'),
  
  body('hostId')
    .notEmpty()
    .withMessage('Host ID is required')
    .isMongoId()
    .withMessage('Invalid host ID'),
  
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Comment is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Comment must be between 10 and 500 characters'),
];

export const updateReviewValidation = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Comment must be between 10 and 500 characters'),
];
