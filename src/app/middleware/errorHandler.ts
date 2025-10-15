import { Request, Response, NextFunction } from "express";

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    statusCode,
  });

  res.status(statusCode).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
