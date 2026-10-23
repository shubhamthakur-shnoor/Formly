
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../utils/validator.js";
import { findUserByEmail, createUser } from "../db/authDB.js";

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

export async function registerUser(req, res) {
  try {
    const { full_name, email, password } = registerSchema.parse(req.body);

    if (await findUserByEmail(email)) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser(full_name, email, passwordHash);

    const { password_hash, ...safeUser } = user;

    return res.status(201).json({
      message: "Registration successful",
      token: generateToken(user.user_id),
      user: safeUser,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.issues });
    }

    if (error.code === "23505") {
      return res.status(409).json({ message: "Email already registered" });
    }

    console.error("Registration error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const { password_hash, ...safeUser } = user;

    return res.status(200).json({
      message: "Login successful",
      token: generateToken(user.user_id),
      user: safeUser,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.issues });
    }

    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
