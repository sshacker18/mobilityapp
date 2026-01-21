import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routers (mounted below)
import authRouter from "./routes/auth";
import bookingsRouter from "./routes/bookings";
import adminRouter from "./routes/admin";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Basic health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mount real routers. These files should export an Express Router.
// If a router is intentionally a placeholder, the file will respond with 501s.
app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/admin", adminRouter);

// Debug endpoint to list mounted base API paths. Useful in development.
app.get("/api/debug/routes", (_req: Request, res: Response) => {
  res.json({ mounted: ["/api/auth", "/api/bookings", "/api/admin"] });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

// error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
});

export default app;
