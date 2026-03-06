import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PORT = Number(process.env.API_PORT || process.env.PORT || 3001);
const JWT_SECRET = process.env.JWT_SECRET || "";

function getJwtSecret() {
  if (!JWT_SECRET) {
    throw new Error(
      "Missing JWT_SECRET. Add JWT_SECRET to your environment variables."
    );
  }
  return JWT_SECRET;
}

function signToken(payload: { sub: string; email: string }) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

function getBearerToken(authHeader: string | undefined) {
  if (!authHeader) return null;
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
}

async function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const token = getBearerToken(req.header("authorization"));
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, getJwtSecret()) as {
      sub: string;
      email: string;
    };
    (req as any).auth = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/login", async (req, res) => {
  const email = String(req.body?.email || "").toLowerCase().trim();
  const password = String(req.body?.password || "");

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "بيانات الدخول غير صحيحة." });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "بيانات الدخول غير صحيحة." });
  }

  const token = signToken({ sub: user.id, email: user.email });
  return res.json({
    token,
    user: { id: user.id, email: user.email },
  });
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  const auth = (req as any).auth as { sub: string; email: string };
  const user = await prisma.user.findUnique({ where: { id: auth.sub } });
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  return res.json({ user: { id: user.id, email: user.email } });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${PORT}`);
});

