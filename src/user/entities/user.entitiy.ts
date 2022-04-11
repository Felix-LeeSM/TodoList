import { ToDos } from '../../to-do-list/entities/todo.list.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Users {
  @ApiProperty({
    name: 'id',
    nullable: false,
    type: 'string',
  })
  @PrimaryColumn('varchar', {
    name: 'id',
    nullable: false,
  })
  id: string;

  @Column('varchar', {
    name: 'password',
    nullable: false,
    length: 50,
  })
  password: string;

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deletedAt',
  })
  deletedAt: Date | null;

  @OneToMany(() => ToDos, (toDos) => toDos.User)
  ToDos: ToDos[];
}
