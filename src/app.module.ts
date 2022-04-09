import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ToDoListModule } from './to-do-list/to-do-list.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user/entities/user.entitiy';
import { ToDos } from './to-do-list/entities/todo.list.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ToDoListModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: '127.0.0.1',
          port: 3306,
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [Users, ToDos],
          logging: true,
          synchronize: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
