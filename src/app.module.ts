import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { PrismaModule } from './prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from 'path';
import { AuthModule } from './modules/auth.module';
import { CompanyModule } from './modules/company.module';
import { JobSeekerModule } from './modules/job_seeker.module';
import { PositionModule } from './modules/position.module';
import { TicketModule } from './modules/ticket.module';

@Module({
  imports: [
    
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    CompanyModule,
    JobSeekerModule,
    PositionModule,
    RedisModule,
    PrismaModule,
    MulterModule.register({
      dest: './uploads'
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads'
    }),
    TicketModule
  ],
  
  exports: []
})

export class AppModule {}