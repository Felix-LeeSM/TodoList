import { Users } from './../user/entities/user.entitiy';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtVerifyType } from './type/auth.type';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}
  MY_SECRET_KEY = this.configService.get<string>('MY_SECRET_KEY');
  ACCESS_TOKEN_DURATION = this.configService.get<string>(
    'ACCESS_TOKEN_DURATION',
  );

  getTokensFromContext(context: ExecutionContext): {
    req;
    accessToken: string;
  } {
    const req = context.getArgByIndex(0);
    const headers: string[] = req.rawHeaders;
    console.log(headers);
    const authorization = headers.indexOf('authorization');
    const accessToken = authorization !== -1 ? headers[authorization + 1] : '';
    return {
      req,
      accessToken,
    };
  }

  jwtVerification(token: string): JwtVerifyType {
    const verified: JwtVerifyType = {
      message: null,
      userId: null,
    };
    jwt.verify(token, this.MY_SECRET_KEY, (err, decoded: jwt.JwtPayload) => {
      if (err) {
        verified.message = err.message;
      } else {
        verified.userId = decoded.sub as string;
      }
    });
    return verified;
  }

  async findUser(id: string) {
    try {
      return await this.usersRepository
        .createQueryBuilder()
        .select('id')
        .where('id = :id', { id })
        .andWhere('deletedAt != null')
        .getOneOrFail();
    } catch {
      throw new UnauthorizedException('No Such User');
    }
  }
}
