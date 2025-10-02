import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { ItemDto } from './dtos/create-item.dto';
import { UserInterceptor } from 'src/users/interceptors/user-serialize.interceptor';
import { ItemResDto } from './dtos/response-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';

@Controller('items')
@UseGuards(AuthGuard)
@UseInterceptors(new UserInterceptor(ItemResDto))
export class ItemsController {
  constructor(private readonly itemService: ItemsService) {}

  @Post('/add-item/:id')
  addItemToList(
    @Param('id') id: string,
    @Body() body: ItemDto,
    @Session() session: any,
  ) {
    return this.itemService.addToList(
      id,
      body.title,
      body.description,
      session,
    );
  }

  // Required id of the item will be deleted, th
  @Delete('/:id')
  deleteItemFromList(@Param('id') id: string, @Session() session: any) {
    return this.itemService.deleteFromList(id, session);
  }

  // Mark the item as completed!
  @Post('/toggle/:id')
  toggleItemStats(@Param('id') id: string, @Session() session: any) {
    return this.itemService.toggleTaskStats(id, session);
  }

  @Patch('/:id')
  updateItem(
    @Param('id') id: string,
    @Session() session: any,
    @Body() body: UpdateItemDto,
  ) {
    return this.itemService.updateItem(id, session, body);
  }
}

// archieve property on list and update controllers and services
// give admin restrication to view all lists
