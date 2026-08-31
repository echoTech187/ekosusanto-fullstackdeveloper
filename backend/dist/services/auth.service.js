"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../repositories/user.repository");
const env_1 = require("../config/env");
const error_middleware_1 = require("../middlewares/error.middleware");
const userRepo = new user_repository_1.UserRepository();
class AuthService {
    async register(data) {
        const existingUser = await userRepo.findByEmail(data.email);
        if (existingUser) {
            throw new error_middleware_1.AppError('Email sudah terdaftar. Silahkan gunakan email lain atau login.', 400);
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        const newUser = await userRepo.create({
            ...data,
            password: hashedPassword,
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name }, env_1.JWT_SECRET, { expiresIn: '7d' });
        return { user: newUser, token };
    }
    async login(data) {
        const user = await userRepo.findByEmail(data.email);
        if (!user) {
            throw new error_middleware_1.AppError('Email atau password tidak sesuai.', 401);
        }
        const isMatch = await bcryptjs_1.default.compare(data.password, user.password);
        if (!isMatch) {
            throw new error_middleware_1.AppError('Email atau password tidak sesuai.', 401);
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role, name: user.name }, env_1.JWT_SECRET, { expiresIn: '7d' });
        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    async getProfile(userId) {
        const user = await userRepo.findById(userId);
        if (!user) {
            throw new error_middleware_1.AppError('Pengguna tidak ditemukan.', 404);
        }
        return user;
    }
}
exports.AuthService = AuthService;
