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

  async createToDo(userId: string, createToDoListDto: CreateToDoListDto) {
    console.log(createToDoListDto);
    const now = new Date();
    const lastTodo = await this.toDosRepository.findOne({
      where: { userId },
      select: ['sequence'],
      order: { sequence: 'DESC' },
    });

    console.log(lastTodo);
    const toDo = await this.toDosRepository.insert(
      this.toDosRepository.create({
        content: createToDoListDto.content,
        userId,
        deadline:
          createToDoListDto.deadline ||
          new Date(now.setDate(now.getDate() + 7)),
        category: createToDoListDto.category || 1,
        sequence: lastTodo ? lastTodo.sequence + 1 : 1,
      }),
    );
    return toDo;
  }

  async findAllToDo(userId: string) {
    console.log(userId, typeof userId);
    const neo = await this.toDosRepository.find({
      where: {
        userId,
        deletedAt: null,
      },
      select: [
        'id',
        'userId',
        'content',
        'isComplete',
        'category',
        'sequence',
        'deadline',
      ],
      order: {
        sequence: 'ASC',
      },
    });
    console.log(neo);
    return neo;
  }

  async deleteOne(userId: string, id: number) {
    try {
      const toDo = await this.toDosRepository.findOneOrFail({
        where: { userId, id },
        select: ['id', 'deletedAt', 'sequence'],
      });

      await this.toDosRepository
        .createQueryBuilder()
        .update()
        .set({ sequence: () => 'sequence - 1' })
        .where('sequence > :sequence', { sequence: toDo.sequence });
      toDo.deletedAt = new Date();
      toDo.sequence = 0;
      const result = await this.toDosRepository.save(toDo);
      return result;
    } catch (err) {
      throw new ForbiddenException('Not Your Todo');
    }
  }

  async changeContent(userId: string, id: number, content: string) {
    try {
      const toDo = await this.toDosRepository.findOneOrFail({
        where: {
          id,
          userId,
          deletedAt: null,
        },
        select: [
          'id',
          'userId',
          'content',
          'isComplete',
          'category',
          'sequence',
          'deadline',
        ],
      });
      toDo.content = content;
      const novelToDo = await this.toDosRepository.save(toDo);
      return novelToDo;
    } catch (err) {
      throw new BadRequestException('Bad Request');
    }
  }

  async changeDeadline(userId: string, id: number, deadline: Date) {
    try {
      const toDo = await this.toDosRepository.findOneOrFail({
        where: {
          id,
          userId,
          deletedAt: null,
        },
        select: [
          'id',
          'userId',
          'content',
          'isComplete',
          'category',
          'sequence',
          'deadline',
        ],
      });
      toDo.deadline = deadline;
      await this.toDosRepository.save(toDo);
      return toDo;
    } catch (err) {
      throw new BadRequestException('Bad Request');
    }
  }

  async completeOne(userId: string, id: number, isComplete: number) {
    console.log(isComplete);
    try {
      const toDo = await this.toDosRepository.findOneOrFail({
        where: {
          id,
          userId,
          deletedAt: null,
        },
        select: [
          'id',
          'userId',
          'content',
          'isComplete',
          'category',
          'sequence',
          'deadline',
        ],
      });
      if (toDo.isComplete === isComplete) return toDo;
      toDo.isComplete = isComplete;
      const result = await this.toDosRepository.save(toDo);
      return result;
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
          .where('userId = :userId', { userId })
          .andWhere('sequence < :from', { from })
          .andWhere('sequence >= :to', { to })
          .execute();
      } else {
        await this.toDosRepository
          .createQueryBuilder()
          .update()
          .set({ sequence: () => 'sequence - 1' })
          .andWhere('sequence > :from', { from })
          .andWhere('sequence <= :to', { to })
          .execute();
      }
      await this.toDosRepository
        .createQueryBuilder()
        .update()
        .set({ sequence: to })
        .where('');
      throw new Error();
    } catch (err) {
      throw new BadRequestException('bad request');
    }
  }
}
