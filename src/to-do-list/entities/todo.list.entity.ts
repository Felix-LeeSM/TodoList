import { Users } from './../../user/entities/user.entitiy';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('id', ['id', 'sequence'])
@Entity()
export class ToDos {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    unsigned: true,
  })
  id: number;

  @Column('varchar', {
    name: 'userId',
    nullable: false,
  })
  userId: string;

  @Column('varchar', {
    name: 'text',
    nullable: false,
  })
  text: string;

  @Column('tinyint', {
    name: 'isComplete',
    nullable: false,
    width: 1,
    default: () => 0,
  })
  isComplete: number;

  @Column('tinyint', {
    name: 'category',
    nullable: false,
    unsigned: true,
  })
  category: number;

  @Column('tinyint', {
    name: 'sequence',
    nullable: false,
  })
  sequence: number;

  @Column('timestamp', {
    name: 'deadline',
    nullable: false,
  })
  deadline: Date;

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
    default: () => null,
  })
  deletedAt: Date | null;

  @ManyToOne(() => Users, (user) => user.ToDos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  User: Users;
}
