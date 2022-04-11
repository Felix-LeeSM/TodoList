import { ToDos } from './entities/todo.list.entity';
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
  ValidationPipe,
} from '@nestjs/common';
import { ToDoListService } from './to-do-list.service';
import { CreateToDoListDto } from './dto/create-to-do-list.dto';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import {
  PatchSequenceDto,
  PatchCompleteDto,
  PatchDeadlineDto,
  PatchContentDto,
} from './dto/update-to-do-list.dto';

@ApiTags('ToDoList APIs')
@ApiHeader({
  name: 'Authorization',
  description: 'accessToken',
})
@Controller('todo')
@UseGuards(authGuard)
export class ToDoListController {
  constructor(private readonly toDoListService: ToDoListService) {}

  @Post()
  @ApiOperation({ summary: 'ToDo 칸반 만들기' })
  @ApiBody({
    type: CreateToDoListDto,
  })
  @ApiCreatedResponse({
    type: ToDos,
  })
  createToDo(
    @Req() req,
    @Body(ValidationPipe) createToDoListDto: CreateToDoListDto,
  ) {
    const userId = req.user;
    return this.toDoListService.createToDo(userId, createToDoListDto);
  }

  @Get()
  @ApiOperation({ summary: 'ToDo 전체 목록 조회' })
  @ApiResponse({
    type: [ToDos],
  })
  findAllToDo(@Req() req) {
    const userId = req.user;
    return this.toDoListService.findAllToDo(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ToDo 칸반 만들기' })
  @ApiParam({
    name: 'id',
    description: '삭제할 칸반 id',
  })
  @ApiResponse({
    type: ToDos,
  })
  deleteOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user;
    return this.toDoListService.deleteOne(userId, id);
  }

  @Patch('content/:id')
  @ApiOperation({ summary: 'ToDo 칸반 컨텐츠 바꾸기' })
  @ApiParam({
    name: 'id',
    description: '수정할 칸반 id',
  })
  @ApiBody({
    type: PatchContentDto,
  })
  @ApiResponse({
    type: ToDos,
  })
  changeContent(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) patchContentDto: PatchContentDto,
  ) {
    const { content } = patchContentDto;
    const userId = req.user;
    if (!content) {
      throw new BadRequestException('Empty content');
    }
    return this.toDoListService.changeContent(userId, id, content);
  }

  @Patch('deadline/:id')
  @ApiOperation({ summary: 'ToDo 칸반 deadline 바꾸기' })
  @ApiParam({
    name: 'id',
    description: '수정할 칸반 id',
  })
  @ApiBody({
    type: PatchDeadlineDto,
  })
  @ApiResponse({
    type: ToDos,
  })
  changeDeadline(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) patchDeadlineDto: PatchDeadlineDto,
  ) {
    const { deadline } = patchDeadlineDto;
    try {
      const userId = req.user;
      return this.toDoListService.changeDeadline(userId, id, deadline);
    } catch (err) {
      throw new BadRequestException(`${err}`);
    }
  }

  @Patch('complete/:id')
  @ApiOperation({ summary: 'ToDo 칸반 완료 여부 바꾸기' })
  @ApiParam({
    name: 'id',
    description: '수정할 칸반 id',
  })
  @ApiBody({
    type: PatchCompleteDto,
  })
  @ApiResponse({
    type: ToDos,
  })
  completeOne(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) patchCompleteDto: PatchCompleteDto,
  ) {
    const { isComplete } = patchCompleteDto;
    if (typeof isComplete !== 'boolean') {
      throw new BadRequestException('Boolean is expected');
    }
    const userId = req.user;
    return this.toDoListService.completeOne(userId, id, +isComplete);
  }

  @Patch('sequence')
  @ApiOperation({ summary: 'ToDo 칸반 순서 바꾸기' })
  @ApiParam({
    name: 'id',
    description: '수정할 칸반 id',
  })
  @ApiBody({
    type: PatchSequenceDto,
  })
  changeSequence(
    @Req() req,
    @Body(ValidationPipe) patchSequenceDto: PatchSequenceDto,
  ) {
    const userId = req.user;
    const { from, to } = patchSequenceDto;
    return this.toDoListService.changeSequence(userId, from, to);
  }
}
