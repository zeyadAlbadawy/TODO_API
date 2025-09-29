import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsFlatController } from './items--flat/items--flat.controller';
import { ItemsController } from './items.controller';

@Module({
  providers: [ItemsService],
  controllers: [ItemsFlatController, ItemsController]
})
export class ItemModule {}
