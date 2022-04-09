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
import { UpdateToDoListDto } from './dto/update-to-do-list.dto';

// todolist dto 만들고
// controller 제대로 설정하고
// service 만들기
// 로직 제대로 찾아봐야 함.

@Controller('todo')
@UseGuards(authGuard)
export class ToDoListController {
  constructor(private readonly toDoListService: ToDoListService) {}

  @Post()
  create(@Req() req, @Body() createToDoListDto: CreateToDoListDto) {
    const userId = req.user;
    return this.toDoListService.create(userId, createToDoListDto);
  }

  @Get()
  findAll(@Req() req) {
    const userId = req.user;
    return this.toDoListService.findAll(userId);
  }

  @Delete(':id')
  deleteOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user;
    return this.toDoListService.deleteOne(userId, id);
  }

  @Patch('content/:id')
  changeText(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
  ) {
    const userId = req.user;
    if (!content) {
      throw new BadRequestException('Empty content');
    }
    return this.toDoListService.changeText(userId, id, content);
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
  completeOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user;
    return this.toDoListService.completeOne(userId, id);
  }

  @Patch('sequence/:id')
  changeSequence(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() body,
  ) {
    const userId = req.user;
    const { from, to } = body;
    return this.toDoListService.changeSequence(userId, id, from, to);
  }
}
