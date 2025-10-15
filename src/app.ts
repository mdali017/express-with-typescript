import express from "express";
import { AuthRoutes } from "./app/modules/auth/auth.routes";
import { errorHandler } from "./app/middleware/errorHandler";
import cors from "cors";
import { router } from "./app/routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bus Daddy Server Runnning Successfully !!!",
  });
});

// Routes
app.use("/api/v1", router);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
