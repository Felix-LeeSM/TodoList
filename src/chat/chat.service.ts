import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './../user/entities/user.entitiy';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  sendChat(client: Socket, createChatDto: CreateChatDto) {
    client.broadcast.emit('msgToClient', createChatDto);
    return;
  }

  async authorize(accessToken: string) {
    const secretKey = this.configService.get<string>('MY_SECRET_KEY');
    try {
      const { id } = jwt.verify(accessToken, secretKey) as any;
      await this.usersRepository.findOneByOrFail(id);
      return id;
    } catch (err) {
      throw new ForbiddenException('Must Login First');
    }
  }
}
