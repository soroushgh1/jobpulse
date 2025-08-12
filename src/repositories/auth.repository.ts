import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { UserRegisterInput } from '../dtos/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';

@Injectable()
export class AuthRepository {

  constructor(
    @Inject("PRISMA_CLIENT") private readonly prismaService: PrismaClient,
    @Inject("REDIS_CLIENT") private readonly redisClient: Redis
  ) {}

  async findOnEmail(email: string): Promise<User | null> {
    const user: User | null = await this.prismaService.user.findUnique({
      where: { email: email },
    });

    return user;
  }

  async findOnPhone(phone: string): Promise<User | null> {
    const user: User | null = await this.prismaService.user.findUnique({
      where: { phone: phone },
    });

    return user;
  }

  async findOnId(id: number): Promise<User | null> {
    const user: User | null = await this.prismaService.user.findUnique({ where: { id: id } });
    return user;
  }

  async createUser(input: UserRegisterInput): Promise<User | null> {
    const hashedPassword: string = await bcrypt.hash(input.password, 10);

    const user: User | null = await this.prismaService.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        role: input.role,
        phone: input.phone,
        username: input.username,
      },
    });

    await this.redisClient.set(`user-${user.id}-note`, "[]");

    return user;
  }

  async findAll(): Promise<Omit<User, "password">[]> {

    const users: Omit<User, "password">[] = await this.prismaService.user.findMany({
      select: {
        id: true,
        phone: true,
        email: true,
        role: true,
        username: true,
        is_banned: true
      }
    });

    if (users.length == 0 || users == null) return [];

    return users;
  }

  async banUser(email: string): Promise<string> {

    const user: User | null = await this.prismaService.user.findUnique({
      where: {
        email: email
      }
    });

    if (!user) throw new NotFoundException('user not found');

    await this.prismaService.user.update({
      where: {
        email: email
      },
      data: {
        is_banned: true
      }
    });

    return "user banned successfuly";
  }

}