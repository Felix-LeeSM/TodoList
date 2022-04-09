import { authGuard } from './auth.guard';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Users } from './../user/entities/user.entitiy';

@Module({
  providers: [AuthService, authGuard],
  imports: [ConfigModule, TypeOrmModule.forFeature([Users])],
  exports: [AuthService, authGuard],
})
export class AuthModule {}
