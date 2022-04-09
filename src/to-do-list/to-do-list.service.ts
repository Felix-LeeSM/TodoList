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
    console.log(createToDoListDto);
    const now = new Date();
    const lastTodo = await this.toDosRepository
      .createQueryBuilder()
      .select('sequence')
      .where('userId = :userId', { userId })
      .orderBy('sequence', 'DESC')
      .getOne();

    const toDo = await this.toDosRepository.insert(
      this.toDosRepository.create({
        content: createToDoListDto.content,
        userId,
        deadline: createToDoListDto.deadline || now.setDate(now.getDate() + 7),
        category: createToDoListDto.category || 1,
        sequence: lastTodo ? lastTodo.sequence + 1 : 1,
      }),
    );
    return toDo;
  }

  async findAll(userId: string) {
    const toDos = await this.toDosRepository
      .createQueryBuilder()
      .select([
        'id',
        'userId',
        'content',
        'isComplete',
        'category',
        'sequence',
        'deadline',
      ])
      .where('userId = :userId AND deletedAt IS NULL', { userId })
      .orderBy('sequence')
      .getMany();
    return toDos;
  }

  async deleteOne(userId: string, id: number) {
    try {
      const toDo = await this.toDosRepository
        .createQueryBuilder()
        .select(['id'])
        .where('userId = :userId', { userId })
        .andWhere('id = :id', { id })
        .andWhere('deletedAt IS NULL')
        .getOneOrFail();
      toDo.deletedAt = new Date();
      toDo.sequence = 0;
      const result = await this.toDosRepository.save(toDo);
      return result;
    } catch (err) {
      throw new ForbiddenException('Not Your Todo');
    }
  }

  async changeText(userId: string, id: number, content: string) {
    try {
      const toDo = await this.toDosRepository
        .createQueryBuilder()
        .select([
          'id',
          'userId',
          'content',
          'isComplete',
          'category',
          'sequence',
          'deadline',
        ])
        .where('userId = :userId', { userId })
        .andWhere('id = :id', { id })
        .andWhere('deletedAt IS NULL')
        .orderBy('sequence')
        .getOneOrFail();
      toDo.content = content;
      const novelToDo = await this.toDosRepository.save(toDo);
      return novelToDo;
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
          'content',
          'isComplete',
          'category',
          'sequence',
          'deadline',
        ])
        .where('userId = :userId', { userId })
        .andWhere('id = :id', { id })
        .andWhere('deletedAt IS NULL')
        .orderBy('sequence')
        .getOneOrFail();
      toDo.deadline = deadline;
      await this.toDosRepository.save(toDo);
      return toDo;
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
          'content',
          'isComplete',
          'category',
          'sequence',
          'deadline',
        ])
        .where('userId = :userId', { userId })
        .andWhere('id = :id', { id })
        .andWhere('deletedAt IS NULL')
        .orderBy('sequence')
        .getOneOrFail();
      toDo.isComplete = Math.abs(toDo.isComplete - 1);
      await this.toDosRepository.save(toDo);
      return toDo;
    } catch (err) {
      throw new BadRequestException('Bad Request');
    }
  }

  async changeSequence(userId: string, id: number, from: number, to: number) {
    try {
      if (from < to) {
        await this.toDosRepository
          .createQueryBuilder()
          .update()
          .set({ sequence: () => 'sequence + 1' })
          .where('sequence < :from', { from })
          .andWhere('sequence > :to', { to })
          .execute();
      } else {
        await this.toDosRepository
          .createQueryBuilder()
          .update()
          .set({ sequence: () => 'sequence - 1' })
          .where('sequence > :from', { from })
          .andWhere('sequence < :to', { to })
          .execute();
      }
      throw new Error();
    } catch (err) {
      throw new BadRequestException('bad request');
    }
  }
}
