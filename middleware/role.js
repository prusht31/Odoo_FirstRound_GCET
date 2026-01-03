// role.js
module.exports = function(requiredRole) {
    return function(req, res, next) {
        // Make sure user object exists (set by auth middleware)
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        if (req.user.role !== requiredRole) {
            return res.status(403).json({ message: "Forbidden: Insufficient role" });
        }

        next();
    };
};
