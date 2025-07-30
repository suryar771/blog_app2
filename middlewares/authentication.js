const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        if (!tokenCookieValue) {
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {
            // Optional: Log or handle token error
            console.error("Invalid token:", error.message);
        }

        next();
    };
}

module.exports = {
    checkForAuthenticationCookie,
};