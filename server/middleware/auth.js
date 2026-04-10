/**
 * Middleware to check if a user is authenticated based on the presence of a user_id cookie.
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
export function requireUser(req, res, next) {
    const userId = req.cookies.user_id;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: No user session" });
    }

    req.userId = userId; // Attach user ID to request object for downstream handlers
    next();
}