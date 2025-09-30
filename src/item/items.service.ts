import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'src/list/entities/list.entity';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { ItemDto } from './dtos/create-item.dto';
import { ListsService } from 'src/list/lists.service';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private Itemrepo: Repository<Item>,
    @InjectRepository(List) private ListRepo: Repository<List>,
    private readonly listService: ListsService,
  ) {}

  async findItem(id: string, session: any) {
    const foundedItem = await this.Itemrepo.findOne({
      where: { id },
      relations: ['list', 'list.user'],
    });

    if (foundedItem?.list.user.id !== session.userId)
      throw new UnauthorizedException(`you are not allowed to do this action`);

    if (!foundedItem)
      throw new NotFoundException(`There is no item with id of ${id}`);

    return foundedItem;
  }

  async addToList(
    id: string,
    title: string,
    description: string | undefined,
    session: any,
  ) {
    // Check the user who creates the list is the one who logged in to add
    // Validate uuid
    const listAttached = await this.listService.checktheListCreator(
      id,
      session,
    );

    // if so push the item to the list
    const newCreatedItem = this.Itemrepo.create({ title, description });
    newCreatedItem.list = listAttached;
    await this.Itemrepo.save(newCreatedItem);

    const savedItem = await this.Itemrepo.findOne({
      where: { id: newCreatedItem.id },
      relations: ['list', 'list.user'], // load needed relations
    });

    return savedItem;
  }

  async deleteFromList(id: string, session: any) {
    // find the item this id belongs to
    if (!uuidValidate(id)) throw new BadRequestException(`Not Valid id`);
    const foundedItem = await this.findItem(id, session);
    await this.Itemrepo.remove(foundedItem);
    return {
      message: `item with id ${id} deleted successfully`,
    };
  }

  async toggleTaskStats(id: string, session: any) {
    const foundedItem = await this.findItem(id, session);
    foundedItem.completed = !foundedItem.completed;
    return this.Itemrepo.save(foundedItem);
  }

  async updateItem(id: string, session: any, attrs: Partial<Item>) {
    const foundedItem = await this.findItem(id, session);
    Object.assign(foundedItem, attrs);
    return this.Itemrepo.save(foundedItem);
  }
}
