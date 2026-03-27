const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Protects routes by verifying the JWT token sent in the Authorization header.
 * 
 * Usage:
 * router.get('/protected', verifyToken, controllerFunction);
 */
const verifyToken = (req, res, next) => {
    // Extract token from Authorization header: "Bearer <token>"
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token, unauthorized" });
    }

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded payload to request for use in controllers
        req.user = decoded;

        // Continue to next middleware/controller
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = verifyToken;