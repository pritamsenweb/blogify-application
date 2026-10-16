const JWT = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "Pr!t@m_$2026##";

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        profileImagURL: user.profileImagURL,
        role: user.role,
    };

    const token = JWT.sign(payload, secret);
    return token;
}

function validateToken(token)
{
    const payload = JWT.verify(token, secret);
    return payload;
}

function checkForAuthenticationCookie(cookieName) {
    return (req, _res, next) => {
        const token = req.cookies[cookieName];
        if (!token) {
            req.user = null;
            return next();
        }
        try {
            const payload = validateToken(token);
            req.user = payload;
        }
        catch (error) {
            req.user = null;
        }
        return next();
    }
}

module.exports = {
    createTokenForUser,
    validateToken,
    checkForAuthenticationCookie
}