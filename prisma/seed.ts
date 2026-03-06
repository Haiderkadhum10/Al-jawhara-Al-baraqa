import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@store.com").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "admin12345";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL/ADMIN_PASSWORD are required (or use defaults).");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  // eslint-disable-next-line no-console
  console.log(`Seeded admin user: ${email}`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

