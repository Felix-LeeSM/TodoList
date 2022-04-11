import { ToDos } from './../to-do-list/entities/todo.list.entity';
import { Users } from './../user/entities/user.entitiy';
import { LoginDto } from './dto/login.dto';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository, UpdateResult } from 'typeorm';
import md5 from 'md5';
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
      throw new UnauthorizedException('Wrong Id');
    }
    if (md5(password) !== user.password)
      throw new UnauthorizedException('Wrong Password');
    const accessToken = jwt.sign({ id }, this.MY_SECRET_KEY, {
      expiresIn: '24h',
    });
    return { accessToken };
  }

  async register(createUserDto: CreateUserDto) {
    const { id, password } = createUserDto;
    const user = await this.usersRepository
      .createQueryBuilder()
      .select('password')
      .where('id = :id', { id })
      .andWhere('deletedAt IS NULL')
      .getOne();
    if (user) throw new UnauthorizedException('Duplicated Id');
    const novelUser = await this.usersRepository.save(
      this.usersRepository.create({
        id,
        password: md5(password),
      }),
    );
    return this.login(novelUser);
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
}
