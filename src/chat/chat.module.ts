import { ConfigModule } from '@nestjs/config';
import { Users } from './../user/entities/user.entitiy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [TypeOrmModule.forFeature([Users]), ConfigModule],
})
export class ChatModule {}
