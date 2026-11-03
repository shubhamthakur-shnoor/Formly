import jwt from "jsonwebtoken";

export function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Respondent authentication
    if (
      decoded.userType === "RESPONDENT" &&
      decoded.respondentId
    ) {
      req.user = {
        respondentId: decoded.respondentId,
        userType: "RESPONDENT",
      };
    }
    // Admin authentication (including older Admin tokens)
    else if (
      decoded.userId &&
      (!decoded.userType || decoded.userType === "ADMIN")
    ) {
      req.user = {
        userId: decoded.userId,
        userType: "ADMIN",
      };
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

// Admin-only middleware
export function authenticateAdmin(req, res, next) {
  authenticateUser(req, res, () => {
    if (req.user.userType !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  });
}

// Respondent-only middleware
export function authenticateRespondent(req, res, next) {
  authenticateUser(req, res, () => {
    if (req.user.userType !== "RESPONDENT") {
      return res.status(403).json({
        success: false,
        message: "Respondent access required",
      });
    }
    next();
  });
}
