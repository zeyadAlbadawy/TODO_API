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
import { ListDto } from './dtos/create-list.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ListsService } from './lists.service';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { CurrentUserInterceptor } from 'src/users/interceptors/current-user.interceptor';
import { UserInterceptor } from 'src/users/interceptors/user-serialize.interceptor';
import { ListResDto } from './dtos/response-list.dto';

@Controller('lists')
@UseInterceptors(CurrentUserInterceptor)
@UseGuards(AuthGuard)
export class ListsController {
  constructor(private readonly listService: ListsService) {}

  @UseInterceptors(new UserInterceptor(ListResDto))
  @Post('/create-list')
  createNewList(@Body() body: ListDto, @CurrentUser() user: User) {
    return this.listService.createList(body.title, user);
  }

  @Patch('/:id')
  updateListInfo(
    @Body() body: ListDto,
    @Param('id') id: string,
    @Session() session: any,
  ) {
    return this.listService.updateList(body.title, id, session);
  }

  @Delete('/:id')
  deleteList(@Param('id') id: string, @Session() session: any) {
    return this.listService.deleteList(id, session);
  }
}
