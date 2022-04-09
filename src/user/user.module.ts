import { AuthModule } from './../auth/auth.module';
import { ToDos } from './../to-do-list/entities/todo.list.entity';
import { Users } from 'src/user/entities/user.entitiy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [AuthModule, TypeOrmModule.forFeature([Users, ToDos])],
})
export class UserModule {}
