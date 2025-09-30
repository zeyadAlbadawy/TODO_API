import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { List } from 'src/list/entities/list.entity';
import { ListsService } from 'src/list/lists.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item, List])],
  providers: [ItemsService, ListsService],
  controllers: [ItemsController],
})
export class ItemModule {}
