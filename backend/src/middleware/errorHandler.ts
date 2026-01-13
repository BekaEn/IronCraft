import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  // Default error
  let error = {
    message: err.message || 'Server Error',
    status: 500
  };

  // Validation error
  if (err.name === 'ValidationError') {
    error.message = 'Validation Error';
    error.status = 400;
  }

  // Duplicate key error
  if (err.name === 'SequelizeUniqueConstraintError') {
    error.message = 'Duplicate field value entered';
    error.status = 400;
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.status = 401;
  }

  res.status(error.status).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
