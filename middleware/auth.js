const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;


        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}




exports.authMiddleware = authMiddleware;