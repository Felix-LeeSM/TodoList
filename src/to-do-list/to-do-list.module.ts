import { AuthModule } from './../auth/auth.module';
import { Users } from 'src/user/entities/user.entitiy';
import { ToDos } from './entities/todo.list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ToDoListService } from './to-do-list.service';
import { ToDoListController } from './to-do-list.controller';

@Module({
  controllers: [ToDoListController],
  providers: [ToDoListService],
  imports: [AuthModule, TypeOrmModule.forFeature([ToDos, Users])],
})
export class ToDoListModule {}
