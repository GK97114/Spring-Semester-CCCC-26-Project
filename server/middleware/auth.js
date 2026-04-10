/**
 * Middleware to check if a user is authenticated based on the presence of a user_id cookie.
 * @param {import("express").Request} req is the Express request object
 * @param {import("express").Response} res is the Express response object
 * @param {import("express").NextFunction} next is the Express next function to pass control to the next middleware
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