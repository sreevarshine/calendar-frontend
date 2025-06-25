import jwt from "jsonwebtoken";

export default function (req, res, next) {
  try {
    // 1. Get the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    // 2. Split and validate the token format
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Token format must be: Bearer <token>",
      });
    }

    const token = parts[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not provided",
      });
    }

    // 3. Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach decoded data to request
    req.user = decoded; // Full decoded payload
    req.userId = decoded.id; // Shortcut for user ID

    next();
  } catch (err) {
    console.error("JWT Authentication error:", err);

    let message = "Invalid token";
    if (err.name === "TokenExpiredError") {
      message = "Token has expired";
    } else if (err.name === "JsonWebTokenError") {
      message = "Malformed token";
    }

    return res.status(401).json({
      success: false,
      message,
      error: err.name,
    });
  }
}
