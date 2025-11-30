import { body } from 'express-validator';

export const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  body('interests')
    .optional({ checkFalsy: true })
    .custom((value) => {
      // Allow single value or array
      if (typeof value === 'string' || Array.isArray(value)) {
        return true;
      }
      throw new Error('Interests must be a string or array');
    }),
  
  body('interests.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each interest must be between 1 and 50 characters'),
];
