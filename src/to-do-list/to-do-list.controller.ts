import { authGuard } from './../auth/auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ToDoListService } from './to-do-list.service';
import { CreateToDoListDto } from './dto/create-to-do-list.dto';

@Controller('todo')
@UseGuards(authGuard)
export class ToDoListController {
  constructor(private readonly toDoListService: ToDoListService) {}

  @Post()
  createToDo(@Req() req, @Body() createToDoListDto: CreateToDoListDto) {
    const userId = req.user;
    return this.toDoListService.createToDo(userId, createToDoListDto);
  }

  @Get()
  findAllToDo(@Req() req) {
    const userId = req.user;
    return this.toDoListService.findAllToDo(userId);
  }

  @Delete(':id')
  deleteOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user;
    return this.toDoListService.deleteOne(userId, id);
  }

  @Patch('content/:id')
  changeContent(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
  ) {
    const userId = req.user;
    if (!content) {
      throw new BadRequestException('Empty content');
    }
    return this.toDoListService.changeContent(userId, id, content);
  }

  @Patch('deadline/:id')
  changeDeadline(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body('deadline') deadline: Date,
  ) {
    try {
      const userId = req.user;
      return this.toDoListService.changeDeadline(userId, id, deadline);
    } catch (err) {
      throw new BadRequestException(`${err}`);
    }
  }

  @Patch('complete/:id')
  completeOne(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body('isComplete') isComplete: boolean,
  ) {
    if (typeof isComplete !== 'boolean') {
      throw new BadRequestException('Boolean is expected');
    }
    const userId = req.user;
    return this.toDoListService.completeOne(userId, id, +isComplete);
  }

  @Patch('sequence/:id')
  changeSequence(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body('to', ParseIntPipe) to: number,
  ) {
    const userId = req.user;
    return this.toDoListService.changeSequence(userId, id, to);
  }
}
