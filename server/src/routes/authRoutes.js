import { Router } from "express";
import { registerUser, loginUser, changePassword, updateProfile } from "../controller/authController.js";
import { authenticateUser } from "../middleware/index.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", authenticateUser, (req, res) => { // for testing
  res.status(200).json({
    message: "Authentication successful",
    userId: req.user.userId,
  });
});
router.patch( "/profile", authenticateUser,  updateProfile);
router.patch("/change-password", authenticateUser, changePassword);

export default router;