import { body } from 'express-validator';

export const createPaymentIntentValidation = [
  body('eventId')
    .notEmpty()
    .withMessage('Event ID is required')
    .isMongoId()
    .withMessage('Invalid event ID'),
];
