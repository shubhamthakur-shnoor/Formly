
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../utils/validator.js";
import { findUserByEmail, createUser, updateUserProfile, getUserPasswordHashById, updateUserPassword, findRespondentByEmail, createRespondent, getRespondentPasswordHashById, updateRespondentPassword, updateRespondentProfile, findUserById, findRespondentById } from "../db/authDB.js";

const generateToken = (userId) =>
  jwt.sign(
    {
      userId,
      userType: "ADMIN",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );

// Respondent JWT
const generateRespondentToken = (respondentId) =>
  jwt.sign(
    {
      respondentId,
      userType: "RESPONDENT",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );

export async function registerUser(req, res) {
  try {
    const { full_name, email, password } = registerSchema.parse(req.body);

    const normalizedEmail = email.trim().toLowerCase();
    // Check both account types
    const [existingAdmin, existingRespondent] = await Promise.all([
      findUserByEmail(normalizedEmail),
      findRespondentByEmail(normalizedEmail),
    ]);

    if (existingAdmin || existingRespondent) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await createUser(
      full_name.trim(),
      normalizedEmail,
      passwordHash
    );

    const { password_hash, ...safeUser } = user;

    return res.status(201).json({
      message: "Registration successful",
      token: generateToken(user.user_id),
      user: {
        ...safeUser,
        user_type: "ADMIN",
      },
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        errors: error.issues,
      });
    }

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Email already registered",
      });
    }
    console.error("Admin registration error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Respondent Signup
export async function registerRespondent(req, res) {
  try {
    const { full_name, email, password } = registerSchema.parse(req.body);
    const normalizedEmail = email.trim().toLowerCase();
    // Check both account types
    const [existingAdmin, existingRespondent] = await Promise.all([
      findUserByEmail(normalizedEmail),
      findRespondentByEmail(normalizedEmail),
    ]);

    if (existingAdmin || existingRespondent) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const respondent = await createRespondent(
      full_name.trim(),
      normalizedEmail,
      passwordHash
    );
    const { password_hash, ...safeRespondent } = respondent;
    return res.status(201).json({
      message: "Registration successful",
      token: generateRespondentToken(respondent.respondent_id),
      user: {
        ...safeRespondent,
        user_type: "RESPONDENT",
      },
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        errors: error.issues,
      });
    }

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    console.error("Respondent registration error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Common Login - Admin + Respondent
export async function loginUser(req, res) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const normalizedEmail = email.trim().toLowerCase();

    // Find account in both tables
    const [admin, respondent] = await Promise.all([
      findUserByEmail(normalizedEmail),
      findRespondentByEmail(normalizedEmail),
    ]);

    // Verify passwords
    const adminMatch = admin
      ? await bcrypt.compare(password, admin.password_hash)
      : false;

    const respondentMatch = respondent
      ? await bcrypt.compare(password, respondent.password_hash)
      : false;

    if (!adminMatch && !respondentMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Prevent ambiguous account selection
    if (adminMatch && respondentMatch) {
      return res.status(409).json({
        message: "Multiple accounts found. Please contact support.",
      });
    }
    // Admin Login
    if (adminMatch) {
      const { password_hash, ...safeUser } = admin;

      return res.status(200).json({
        message: "Login successful",
        token: generateToken(admin.user_id),
        user: {
          ...safeUser,
          user_type: "ADMIN",
        },
      });
    }
    // Respondent Login
    const { password_hash, ...safeUser } = respondent;

    return res.status(200).json({
      message: "Login successful",
      token: generateRespondentToken(respondent.respondent_id),
      user: {
        ...safeUser,
        user_type: "RESPONDENT",
      },
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        errors: error.issues,
      });
    }

    console.error("Login error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
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

    let user;
    let userId;

    if (req.user.userType === "ADMIN") {
      userId = req.user.userId;
      user = await getUserPasswordHashById(userId);
    } else if (req.user.userType === "RESPONDENT") {
      userId = req.user.respondentId;
      user = await getRespondentPasswordHashById(userId);
    } else {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const isValid = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );

    if (!isValid) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    if (req.user.userType === "ADMIN") {
      await updateUserPassword(userId, passwordHash);
    } else {
      await updateRespondentPassword(userId, passwordHash);
    }

    return res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error.message);
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
        message: "Full name and email are required.",
      });
    }

    const normalizedName = full_name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedName.length > 100) {
      return res.status(400).json({
        message: "Full name cannot exceed 100 characters.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (normalizedEmail.length > 255 || !emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    let updatedUser;

    if (req.user.userType === "ADMIN") {
      const existingRespondent =
        await findRespondentByEmail(normalizedEmail);

      if (existingRespondent) {
        return res.status(409).json({
          message: "This email is already registered.",
        });
      }

      updatedUser = await updateUserProfile(
        req.user.userId,
        normalizedName,
        normalizedEmail
      );
    } else if (req.user.userType === "RESPONDENT") {
      const existingAdmin = await findUserByEmail(normalizedEmail);

      if (existingAdmin) {
        return res.status(409).json({
          message: "This email is already registered.",
        });
      }

      updatedUser = await updateRespondentProfile(
        req.user.respondentId,
        normalizedName,
        normalizedEmail
      );
    } else {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        ...updatedUser,
        user_type: req.user.userType,
      },
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
export async function getCurrentProfile(req, res) {
  try {
    let user;

    if (req.user.userType === "ADMIN") {
      user = await findUserById(req.user.userId);
    } else if (req.user.userType === "RESPONDENT") {
      user = await findRespondentById(req.user.respondentId);
    } else {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully.",
      user: {
        ...user,
        user_type: req.user.userType,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}