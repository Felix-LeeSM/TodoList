import { ToDos } from './../to-do-list/entities/todo.list.entity';
import { Users } from './../user/entities/user.entitiy';
import { LoginDto } from './dto/login.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}
  MY_SECRET_KEY = this.configService.get<string>('MY_SECRET_KEY');

  async login(loginDto: LoginDto) {
    const { id, password } = loginDto;
    try {
      const user = await this.usersRepository.findOneOrFail({
        where: { id, deletedAt: null },
        select: ['password'],
      });
      if (md5(password) !== user.password)
        throw new UnauthorizedException('Wrong Password');
      const accessToken = jwt.sign({ id }, this.MY_SECRET_KEY, {
        expiresIn: '24h',
      });
      return { accessToken };
    } catch (err) {
      throw new UnauthorizedException('Wrong Id');
    }
  }

  async create(createUserDto: CreateUserDto) {
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

  async remove(id: string) {
    const userResult = await this.usersRepository.softDelete(id);
    const toDoResult = await this.toDosRepository.softDelete({ userId: id });
    return { userResult, toDoResult };
  }
}
