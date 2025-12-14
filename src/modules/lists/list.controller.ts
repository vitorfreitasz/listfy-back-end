import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UpdateListDto } from './dto/update-list.dto';
import { CreateListDto } from './dto/create-list.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { RemoveParticipantDto } from './dto/remove-participant.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { ListService } from './list.service';

@ApiTags('Lists')
@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async create(@Body() dto: CreateListDto, @GetUser() user: User) {
    return this.listService.create(dto, user);
  }

  @Get()
  async findAll(@GetUser() user: User) {
    return this.listService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @GetUser() user: User) {
    return this.listService.findOne(id, user);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateListDto,
    @GetUser() user: User,
  ) {
    return this.listService.update(id, dto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser() user: User) {
    return this.listService.remove(id, user);
  }

  @Post(':id/participants')
  async addParticipant(
    @Param('id') id: number,
    @Body() dto: AddParticipantDto,
    @GetUser() user: User,
  ) {
    return this.listService.addParticipant(id, dto, user);
  }

  @Delete(':id/participants')
  async removeParticipant(
    @Param('id') id: number,
    @Body() dto: RemoveParticipantDto,
    @GetUser() user: User,
  ) {
    return this.listService.removeParticipant(id, dto, user);
  }

  @Get(':id/participants')
  async getParticipants(@Param('id') id: number, @GetUser() user: User) {
    return this.listService.getParticipants(id, user);
  }
}
