import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import PrismaService from 'prisma/prisma.service';
import { UserRegisterInput } from './DTO/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthRepository {

  constructor(private readonly prismaService: PrismaService) {}

  async FindOnEmail(email: string): Promise<User | null> {
    const user: User | null = await this.prismaService.user.findUnique({
      where: { email: email },
    });

    return user;
  }

  async FindOnPhone(phone: string): Promise<User | null> {
    const user: User | null = await this.prismaService.user.findUnique({
      where: { phone: phone },
    });

    return user;
  }

  async FindOnId(id: number): Promise<User | null> {
    const user: User | null = await this.prismaService.user.findUnique({ where: { id: id } });
    return user;
  }

  async CreateUser(input: UserRegisterInput): Promise<User | null> {
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

    return user;
  }

}