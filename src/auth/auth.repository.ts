import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { UserRegisterInput } from './DTO/auth.dto';
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

}