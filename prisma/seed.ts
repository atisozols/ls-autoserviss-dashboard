import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.SEED_USERNAME ?? "admin";
  const password = process.env.SEED_PASSWORD ?? "admin123";

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    console.log(`User "${username}" already exists.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { username, passwordHash } });
  console.log(`Created user: ${username} / ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
