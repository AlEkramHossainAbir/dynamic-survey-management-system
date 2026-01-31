const jwt = require("jsonwebtoken");
require("dotenv").config();

// Authentication middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });
   if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token expired or invalid" });
  }
};

// Role-based authorization
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Access denied" });
    next();
  };
};

module.exports = { authenticateJWT, authorizeRole };
