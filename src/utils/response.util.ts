import { Response } from 'express';

interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    ...(data && { data }),
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: unknown
): void => {
  const response: ErrorResponse = {
    success: false,
    message,
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  res.status(statusCode).json(response);
};
