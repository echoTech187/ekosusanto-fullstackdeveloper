"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Akses ditolak. Token otentikasi tidak ditemukan.',
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).json({
            success: false,
            message: 'Token otentikasi tidak valid atau telah kedaluwarsa.',
        });
        return;
    }
};
exports.authenticateToken = authenticateToken;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Tidak terotentikasi.' });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `Akses ditolak. Fitur ini hanya untuk role: ${roles.join(', ')}`,
            });
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
