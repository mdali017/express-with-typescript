import { Request, Response, NextFunction } from "express";
import supabase from "../config/supabaseClient";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Verify JWT token from Authorization header
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token",
      });
    }

    // Get user profile from database
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("id", data.user.id)
      .single();

    if (profileError || !userProfile) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User profile not found",
      });
    }

    // Attach user to request object
    req.user = {
      id: userProfile.id,
      email: userProfile.email,
      role: userProfile.role,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication",
    });
  }
};

/**
 * Authorize based on user roles
 */
export const authorize = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // First authenticate the user
      await authenticate(req, res, () => {});

      // Check if user exists (should be set by authenticate)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not authenticated",
        });
      }

      // Check if user's role is in the allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden: You do not have permission to access this resource",
        });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during authorization",
      });
    }
  };
};
