import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';
import { JWT_SECRET } from '../config/env';
import { AppError } from '../middlewares/error.middleware';

const userRepo = new UserRepository();

export class AuthService {
  async register(data: { email: string; password: string; name: string; role: Role }) {
    const existingUser = await userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email sudah terdaftar. Silahkan gunakan email lain atau login.', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await userRepo.create({
      ...data,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { user: newUser, token };
  }

  async login(data: { email: string; password: string }) {
    const user = await userRepo.findByEmail(data.email);
    if (!user) {
      throw new AppError('Email atau password tidak sesuai.', 401);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new AppError('Email atau password tidak sesuai.', 401);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getProfile(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new AppError('Pengguna tidak ditemukan.', 404);
    }
    return user;
  }
}
