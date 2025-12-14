import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([List, User])],
  providers: [ListService],
  controllers: [ListController],
  exports: [],
})
export class ListModule {}
