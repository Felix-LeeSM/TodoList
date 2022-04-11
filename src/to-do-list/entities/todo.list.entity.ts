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
import { ApiProperty } from '@nestjs/swagger';

@Index('id', ['id', 'sequence'])
@Entity()
export class ToDos {
  @ApiProperty({
    name: 'id',
    nullable: false,
    type: 'number',
    description: '칸반의 id',
  })
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    unsigned: true,
  })
  id: number;

  @ApiProperty({
    name: 'userId',
    nullable: false,
    type: 'string',
    description: '작성 user의 id',
  })
  @Column('varchar', {
    name: 'userId',
    nullable: false,
  })
  userId: string;

  @ApiProperty({
    name: 'content',
    nullable: false,
    type: 'string',
    description: '칸반의 내용',
  })
  @Column('varchar', {
    name: 'content',
    nullable: false,
  })
  content: string;

  @ApiProperty({
    name: 'isComplete',
    nullable: false,
    type: 'boolean',
    description: '칸반의 완료 여부',
    default: false,
  })
  @Column('tinyint', {
    name: 'isComplete',
    nullable: false,
    width: 1,
    default: () => 0,
  })
  isComplete: number;

  @ApiProperty({
    name: 'category',
    nullable: false,
    type: 'number',
    description: '칸반의 카테고리',
  })
  @Column('tinyint', {
    name: 'category',
    nullable: false,
    unsigned: true,
  })
  category: number;

  @ApiProperty({
    name: 'sequence',
    nullable: false,
    type: 'number',
    description: '칸반의 순서',
  })
  @Column('tinyint', {
    name: 'sequence',
    nullable: false,
  })
  sequence: number;

  @ApiProperty({
    name: 'deadline',
    nullable: false,
    type: 'Date',
    description: '칸반의 deadline',
  })
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
