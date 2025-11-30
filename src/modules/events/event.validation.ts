import { body } from 'express-validator';

export const createEventValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'Concerts',
      'Sports',
      'Hiking',
      'Tech Meetups',
      'Gaming',
      'Food & Dining',
      'Arts & Culture',
      'Networking',
      'Workshops',
      'Other',
    ])
    .withMessage('Invalid category'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
  
  body('time')
    .notEmpty()
    .withMessage('Time is required'),
  
  body('maxParticipants')
    .notEmpty()
    .withMessage('Maximum participants is required')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Maximum participants must be between 1 and 1000'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
  
  body('isPaid')
    .optional()
    .isBoolean()
    .withMessage('isPaid must be a boolean'),
];

export const updateEventValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('category')
    .optional()
    .isIn([
      'Concerts',
      'Sports',
      'Hiking',
      'Tech Meetups',
      'Gaming',
      'Food & Dining',
      'Arts & Culture',
      'Networking',
      'Workshops',
      'Other',
    ])
    .withMessage('Invalid category'),
  
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('time')
    .optional()
    .notEmpty()
    .withMessage('Time cannot be empty'),
  
  body('maxParticipants')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Maximum participants must be between 1 and 1000'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
  
  body('isPaid')
    .optional()
    .isBoolean()
    .withMessage('isPaid must be a boolean'),
  
  body('status')
    .optional()
    .isIn(['upcoming', 'ongoing', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
];
