import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';

export const verifyToken = async (req, res, next) => {
    try {
        let token;

        // Read token from Authorization header
        if (req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1]; // "Bearer token"
        }

        // OR read from authtoken
        if (!token && req.headers.authtoken) {
            token = req.headers.authtoken;
        }

        if (!token) return next(createError(401, 'Token is required'));

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedData;

        next();
    } catch (err) {
        next(createError(401, 'Invalid token'));
    }
};

export const verifyEmployee = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            const allowedRoles = ['employee', 'manager', 'super_admin'];
            if (allowedRoles.includes(req.user.role)) {
                next();
            } else {
                next(createError(403, 'Only employee can access this route'))
            }
        });
    } catch (err) {
        next(createError(500, err.message));
    }
};

export const verifyManager = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            const allowedRoles = ['manager', 'super_admin'];
            if (allowedRoles.includes(req.user.role)) {
                next();
            } else {
                next(createError(403, 'Only manager can access this route'))
            }
        });
    } catch (err) {
        next(createError(500, err.message));
    }
};

export const verifySuperAdmin = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            if (req.user.role === 'super_admin') {
                next();
            } else {
                next(createError(403, 'Access denied'))
            }
        });
    } catch (err) {
        next(createError(500, err.message));
    }
};

export default function (err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
};
