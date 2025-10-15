import { Router } from "express";
import { AuthController } from "./auth.controller";
// import { authorize } from "../../middleware/authMiddleware";

const router = Router();

// Auth routes
router.post("/create-user", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.get("/google", AuthController.loginWithGoogle);
router.get("/facebook", AuthController.loginWithFacebook);

// OAuth callback routes
router.get("/callback/google", AuthController.handleGoogleCallback);
router.get("/callback/facebook", AuthController.handleFacebookCallback);

// Admin routes
router.delete("/delete-user/:userId", AuthController.deleteUser);

export const AuthRoutes = router;
