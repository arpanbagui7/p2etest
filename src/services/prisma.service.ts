import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient({
  errorFormat: "minimal",
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export default prisma