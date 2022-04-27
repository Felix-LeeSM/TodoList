import { ToDos } from './entities/todo.list.entity';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateToDoListDto } from './dto/create-to-do-list.dto';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class ToDoListService {
  constructor(
    @InjectRepository(ToDos)
    private readonly toDosRepository: Repository<ToDos>,
    private readonly connection: Connection,
  ) {}

  async createToDo(userId: string, createToDoListDto: CreateToDoListDto) {
    const now = new Date();
    const lastTodo = await this.toDosRepository.findOne({
      where: { userId },
      select: ['sequence'],
      order: { sequence: 'DESC' },
    });

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
    const ToDos = await this.toDosRepository.find({
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
    return ToDos;
  }

  async deleteOne(userId: string, id: number) {
    let toDo: ToDos;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      toDo = await this.toDosRepository.findOneOrFail({
        where: { userId, id },
        select: ['id', 'deletedAt', 'sequence'],
      });
    } catch (err) {
      throw new ForbiddenException('No Such Todo');
    }
    try {
      await queryRunner.manager
        .getRepository(ToDos)
        .createQueryBuilder()
        .update()
        .set({ sequence: () => 'sequence - 1' })
        .where('sequence > :sequence', { sequence: toDo.sequence })
        .andWhere('deletedAt IS NULL')
        .execute();
      toDo.deletedAt = new Date();
      toDo.sequence = 0;
      await queryRunner.manager.getRepository(ToDos).save(toDo);
      await queryRunner.commitTransaction();
    } catch (err) {
      toDo = null;
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      if (toDo) return toDo;
      throw new InternalServerErrorException('Please Try Again');
    }
  }

  async changeContent(userId: string, id: number, content: string) {
    try {
      const toDo = await this.findTodo({ id, userId });
      toDo.content = content;
      const novelToDo = await this.toDosRepository.save(toDo);
      return novelToDo;
    } catch (err) {
      throw new BadRequestException('Bad Request');
    }
  }

  async changeDeadline(userId: string, id: number, deadline: Date) {
    try {
      const toDo = await this.findTodo({ id, userId });
      toDo.deadline = deadline;
      await this.toDosRepository.save(toDo);
      return toDo;
    } catch (err) {
      throw new BadRequestException('Bad Request');
    }
  }

  async completeOne(userId: string, id: number, isComplete: number) {
    try {
      const toDo = await this.findTodo({ id, userId });
      if (toDo.isComplete === isComplete) return toDo;
      toDo.isComplete = isComplete;
      const result = await this.toDosRepository.save(toDo);
      return result;
    } catch (err) {
      throw new BadRequestException('Bad Request');
    }
  }

  async changeSequence(userId: string, From: number, To: number) {
    let from: number;
    let to: number;
    let prep: ToDos;
    let next: ToDos;
    try {
      [prep, next] = await Promise.all([
        this.toDosRepository.findOneOrFail({
          where: {
            sequence: From,
            userId,
          },
          select: ['id', 'sequence'],
        }),
        this.toDosRepository.findOneOrFail({
          where: {
            sequence: To,
            userId,
          },
          select: ['sequence'],
        }),
      ]);
      [from, to] = [prep.sequence, next.sequence];
      if (from === to) return await this.findAllToDo(userId);
    } catch (err) {
      throw new BadRequestException('Bad Request');
    }
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (from < to) {
        await queryRunner.manager
          .getRepository(ToDos)
          .createQueryBuilder()
          .update()
          .set({ sequence: () => 'sequence - 1' })
          .where('userId = :userId', { userId })
          .andWhere('sequence > :from', { from })
          .andWhere('sequence <= :to', { to })
          .andWhere('deletedAt IS NULL')
          .execute();
      } else {
        await queryRunner.manager
          .getRepository(ToDos)
          .createQueryBuilder()
          .update()
          .set({ sequence: () => 'sequence + 1' })
          .where('userId = :userId', { userId })
          .andWhere('sequence < :from', { from })
          .andWhere('sequence >= :to', { to })
          .andWhere('deletedAt IS NULL')
          .execute();
      }
      prep.sequence = to;
      await queryRunner.manager.getRepository(ToDos).save(prep);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return await this.findAllToDo(userId);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new InternalServerErrorException('Please Try Again');
    }
  }

  async findTodo({ id, userId }) {
    return await this.toDosRepository.findOneOrFail({
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
        'startsAt',
      ],
    });
  }
}
