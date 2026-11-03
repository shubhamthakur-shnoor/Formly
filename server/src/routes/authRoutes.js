import { Router } from "express";
import {
  registerUser,
  loginUser,
  changePassword,
  updateProfile,
  registerRespondent,
  getCurrentProfile,
} from "../controller/authController.js";

import { authenticateUser } from "../middleware/index.js";

const router = Router();

// Admin registration
router.post("/register", registerUser);

// Common login - Admin + Respondent
router.post("/login", loginUser);

// Respondent signup
router.post("/respondent/register", registerRespondent);

// Common profile APIs - Admin + Respondent
router.get("/profile", authenticateUser, getCurrentProfile);
router.patch("/profile", authenticateUser, updateProfile);

// Common password API - Admin + Respondent
router.patch("/change-password", authenticateUser, changePassword);

export default router;