import { ToDos } from './entities/todo.list.entity';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateToDoListDto } from './dto/create-to-do-list.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ToDoListService {
  constructor(
    @InjectRepository(ToDos)
    private readonly toDosRepository: Repository<ToDos>,
  ) {}
  async create(userId: string, createToDoListDto: CreateToDoListDto) {
    const now = new Date();
    const lastOrder = (
      await this.toDosRepository
        .createQueryBuilder()
        .select('order')
        .where('userId = :userId', { userId })
        .orderBy('order', 'DESC')
        .getOne()
    ).order;
    const toDo = await this.toDosRepository.insert(
      this.toDosRepository.create({
        text: createToDoListDto.text,
        userId,
        deadline: createToDoListDto.deadline || now.setDate(now.getDate() + 7),
        category: createToDoListDto.category || 1,
        order: lastOrder + 1,
      }),
    );
    return { toDo };
  }

  async findAll(id: string) {
    const toDos = await this.toDosRepository
      .createQueryBuilder()
      .select([
        'id',
        'userId',
        'text',
        'isComplete',
        'category',
        'order',
        'deadline',
      ])
      .where('userId = :id', { id })
      .andWhere('deletedAt != :null', { null: null })
      .orderBy('order')
      .getMany();
    return { toDos };
  }

  async deleteOne(userId: string, id: number) {
    try {
      const toDo = await this.toDosRepository
        .createQueryBuilder()
        .select(['id'])
        .where('userId = :userId', { userId })
        .andWhere('id = :id', { id })
        .andWhere('deletedAt != :null', { null: null })
        .getOneOrFail();
      toDo.deletedAt = new Date();
      toDo.order = 0;
      const result = await this.toDosRepository.save(toDo);
      return { result };
    } catch (err) {
      throw new ForbiddenException('Not Your Todo');
    }
  }

  async changeText(userId: string, id: number, text: string) {
    try {
      const toDo = await this.toDosRepository
        .createQueryBuilder()
        .select([
          'id',
          'userId',
          'text',
          'isComplete',
          'category',
          'order',
          'deadline',
        ])
        .where('userId = :userId', { userId })
        .andWhere('id = :id', { id })
        .andWhere('deletedAt != :null', { null: null })
        .orderBy('order')
        .getOneOrFail();
      toDo.text = text;
      const novelToDo = await this.toDosRepository.save(toDo);
      return { toDo: novelToDo };
    } catch (err) {
      throw new BadRequestException('Bad Request');
    }
  }

  async changeDeadline(userId: string, id: number, deadline: Date) {
    try {
      const toDo = await this.toDosRepository
        .createQueryBuilder()
        .select([
          'id',
          'userId',
          'text',
          'isComplete',
          'category',
          'order',
          'deadline',
        ])
        .where('userId = :userId', { userId })
        .andWhere('id = :id', { id })
        .andWhere('deletedAt != :null', { null: null })
        .orderBy('order')
        .getOneOrFail();
      toDo.deadline = deadline;
      await this.toDosRepository.save(toDo);
      return { toDo };
    } catch (err) {
      throw new BadRequestException('Bad Request');
    }
  }

  async completeOne(userId: string, id: number) {
    try {
      const toDo = await this.toDosRepository
        .createQueryBuilder()
        .select([
          'id',
          'userId',
          'text',
          'isComplete',
          'category',
          'order',
          'deadline',
        ])
        .where('userId = :userId', { userId })
        .andWhere('id = :id', { id })
        .andWhere('deletedAt != :null', { null: null })
        .orderBy('order')
        .getOneOrFail();
      toDo.isComplete = Math.abs(toDo.isComplete - 1);
      await this.toDosRepository.save(toDo);
      return { toDo };
    } catch (err) {
      throw new BadRequestException('Bad Request');
    }
  }

  changeOrder(userId: string, id: number, from: number, to: number) {
    try {
      throw new Error();
    } catch (err) {
      throw new BadRequestException('bad request');
    }
  }
}
