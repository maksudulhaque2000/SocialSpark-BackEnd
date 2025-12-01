import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ZodSchema } from 'zod';

// Middleware for express-validator
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
    return;
  }

  next();
};

// Middleware for Zod validation
export const validateZod = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors || [{ message: error.message }],
      });
    }
  };
};
