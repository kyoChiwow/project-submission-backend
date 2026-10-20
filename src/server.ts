import "dotenv/config";
import http from "node:http";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const port = Number(process.env.PORT || 5000);
const server = http.createServer(app);

async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("Set JWT_SECRET to a random value with at least 32 characters");
  }
  await prisma.$connect();
  server.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}
async function shutdown(signal: string) {
  console.log(`${signal} received; shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
start().catch(async (error) => {
  console.error("Startup failed", error);
  await prisma.$disconnect();
  process.exit(1);
});