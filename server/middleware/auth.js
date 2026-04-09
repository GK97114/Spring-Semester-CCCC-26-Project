/**
 * Middleware to check if a user is authenticated based on the presence of a user_id cookie.
 */
export function requireUser(req, res, next) {
    const userId = req.cookies.user_id;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: No user session" });
    }

    req.userId = userId; // Attach user ID to request object for downstream handlers
    next();
}