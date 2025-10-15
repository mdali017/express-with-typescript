import { Request, Response, NextFunction } from "express";

/**
 * Catch async errors and pass them to error handling middleware
 */
const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;