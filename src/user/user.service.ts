import { ToDos } from './../to-do-list/entities/todo.list.entity';
import { Users } from './../user/entities/user.entitiy';
import { LoginDto } from './dto/login.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
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
        where: { id },
        select: ['password'],
      });
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new UnauthorizedException('Wrong Password');
      }
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
      .andWhere('deletedAt != null')
      .getOne();
    if (user) throw new UnauthorizedException('Duplicated Id');
    const hashed = await bcrypt.hash(password, '');

    const novelUser = await this.usersRepository.save({
      id,
      password: hashed,
    });
    return this.login(novelUser);
  }

  async remove(id: string) {
    const userResult = await this.usersRepository.softDelete(id);
    const toDoResult = await this.toDosRepository.softDelete({ userId: id });
    return { userResult, toDoResult };
  }
}
