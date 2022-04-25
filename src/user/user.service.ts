import { ToDos } from './../to-do-list/entities/todo.list.entity';
import { Users } from './../user/entities/user.entitiy';
import { LoginDto } from './dto/login.dto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository, UpdateResult } from 'typeorm';
import * as md5 from 'md5';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(ToDos)
    private readonly toDosRepository: Repository<ToDos>,
    private readonly configService: ConfigService,
    private readonly connection: Connection,
  ) {}
  MY_SECRET_KEY = this.configService.get<string>('MY_SECRET_KEY');

  async login(loginDto: LoginDto) {
    const { id, password } = loginDto;
    let user: Users;
    try {
      user = await this.usersRepository.findOneOrFail({
        where: { id, deletedAt: null },
        select: ['password'],
      });
    } catch (err) {
      throw new UnauthorizedException('존재하지 않는 아이디입니다.');
    }
    if (md5(password) !== user.password)
      throw new ForbiddenException('잘못된 비밀번호입니다.');
    const accessToken = jwt.sign({ id }, this.MY_SECRET_KEY, {
      expiresIn: '24h',
    });
    return { accessToken };
  }

  async register(createUserDto: CreateUserDto) {
    const { id, password } = createUserDto;
    let isOk = true;
    try {
      await this.usersRepository
        .createQueryBuilder()
        .select('id')
        .where('id = :id', { id })
        .getOneOrFail();
      isOk = false;
    } catch (err) {
      if (!isOk) throw new ConflictException('중복된 아이디입니다.');
      const novelUser = await this.usersRepository.save(
        this.usersRepository.create({
          id,
          password: md5(password),
        }),
      );
      return novelUser;
    }
  }

  async withdrawal(id: string) {
    let isError = false;
    let result: UpdateResult;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      result = await queryRunner.manager.getRepository(Users).softDelete(id);
      await queryRunner.manager.getRepository(ToDos).softDelete({ userId: id });
      await queryRunner.commitTransaction();
    } catch (err) {
      isError = true;
      await queryRunner.rollbackTransaction();
    } finally {
    }
    await queryRunner.release();
    if (isError) throw new InternalServerErrorException('Please Try Again');
    return result;
  }

  async duplicationCheck(id: string) {
    try {
      await this.usersRepository.findOneOrFail({
        where: { id },
        select: ['id'],
      });
      return false;
    } catch (err) {
      return true;
    }
  }
}
