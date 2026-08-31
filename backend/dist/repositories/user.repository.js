"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../config/prisma");
class UserRepository {
    async findByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    }
    async findById(id) {
        return prisma_1.prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true, name: true, role: true, createdAt: true },
        });
    }
    async create(data) {
        return prisma_1.prisma.user.create({
            data,
            select: { id: true, email: true, name: true, role: true, createdAt: true },
        });
    }
}
exports.UserRepository = UserRepository;
