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

  @Patch('text/:id')
  changeText(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body('text') text: string,
  ) {
    const userId = req.user;
    if (!text) {
      throw new BadRequestException('Empty text');
    }
    return this.toDoListService.changeText(userId, id, text);
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

  @Patch('order/:id')
  changeOrder(@Req() req, @Param('id', ParseIntPipe) id: number, @Body() body) {
    const userId = req.user;
    const { from, to } = body;
    return this.toDoListService.changeOrder(userId, id, from, to);
  }
}
