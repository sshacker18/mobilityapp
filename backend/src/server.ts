import app from "./app";
import prisma from "./prisma";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function start() {
  try {
    // Try connect to DB early so startup fails fast on DB errors
    await prisma.$connect();
    console.log("Prisma connected to DB");

    const server = app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });

    const shutdown = async () => {
      console.log("Shutting down...");
      server.close(async () => {
        await prisma.$disconnect();
        console.log("Prisma disconnected. Exiting.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("Failed to start server:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

start();
