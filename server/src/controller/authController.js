
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../utils/validator.js";
import { findUserByEmail, createUser, updateUserProfile, getUserPasswordHashById, updateUserPassword } from "../db/authDB.js";

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

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All password fields are required.",
      });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must contain at least 8 characters.",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match.",
      });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from current password.",
      });
    }
    const userId = req.user.userId;
    const user = await getUserPasswordHashById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }
    const passwordHash = await bcrypt.hash(newPassword, 12);
    const updatedUser = await updateUserPassword(
      userId,
      passwordHash
    );
    return res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}

export async function updateProfile(req, res) {
  try {
    const { full_name, email } = req.body;

    if (
      typeof full_name !== "string" ||
      typeof email !== "string" ||
      !full_name.trim() ||
      !email.trim()
    ) {
      return res.status(400).json({
        message: "Username and email are required.",
      });
    }

    const normalizedName = full_name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedName.length > 100) {
      return res.status(400).json({
        message: "Username cannot exceed 100 characters.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      normalizedEmail.length > 255 ||
      !emailRegex.test(normalizedEmail)
    ) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    const userId = req.user.userId;

    const updatedUser = await updateUserProfile(
      userId,
      normalizedName,
      normalizedEmail
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "This email is already registered.",
      });
    }

    console.error("Update profile error:", error.message);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}