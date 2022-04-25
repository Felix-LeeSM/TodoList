import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer()
  public server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    const accessToken = client.handshake.headers.Authorization as string;
    const id = this.chatService.authorize(accessToken);
    client.rooms.clear();
    client.join('main');
    return;
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    client.rooms.clear();
    return;
  }

  @SubscribeMessage('chatToServer')
  sendChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() createChatDto: CreateChatDto,
  ) {
    return this.chatService.sendChat(client, createChatDto);
  }
}
