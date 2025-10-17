import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({
                success: false,
                message: 'Not Authorized. Login again'
            });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (!tokenDecode.id) {
            return res.json({
                success: false,
                message: 'Not Authorized. Login again'
            });
        }

        req.body = req.body || {};
        req.body.userId = tokenDecode.id;

        next();
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};

export default userAuth;