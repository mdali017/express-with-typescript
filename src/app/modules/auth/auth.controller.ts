import type { Request, Response } from "express";
import { AuthServices } from "./auth.service";
import { config } from "../../config/env";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

/**
 * Create new user
 */
const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: result.message,
    data: result.user,
  });
});

/**
 * Login user
 */
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    data: result,
  });
});

/**
 * Initiate Google OAuth login
 */
const loginWithGoogle = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginWithGoogle();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Google OAuth URL generated",
    data: result,
  });
});

/**
 * Initiate Facebook OAuth login
 */
const loginWithFacebook = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginWithFacebook();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Facebook OAuth URL generated",
    data: result,
  });
});

/**
 * Handle Google OAuth callback
 */
const handleGoogleCallback = catchAsync(async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${config.frontendUrl}/login?error=auth_failed`);
  }

  const result = await AuthServices.handleOAuthCallback(code as string);

  res.redirect(
    `${config.frontendUrl}/login?auth=success&session=${result.session.access_token}`
  );
});

/**
 * Handle Facebook OAuth callback
 */
const handleFacebookCallback = catchAsync(
  async (req: Request, res: Response) => {
    const { code } = req.query;

    if (!code) {
      return res.redirect(`${config.frontendUrl}/login?error=auth_failed`);
    }

    const result = await AuthServices.handleOAuthCallback(code as string);

    res.redirect(
      `${config.frontendUrl}/login?auth=success&session=${result.session.access_token}`
    );
  }
);

/**
 * Delete user
 */
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await AuthServices.deleteUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: result.message,
    data: null,
  });
});

export const AuthController = {
  createUser,
  loginUser,
  loginWithGoogle,
  loginWithFacebook,
  handleGoogleCallback,
  handleFacebookCallback,
  deleteUser,
};
