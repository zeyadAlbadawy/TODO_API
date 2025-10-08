import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class ListsService {
  constructor(@InjectRepository(List) private repo: Repository<List>) {}

  // Helper
  async checktheListCreator(id: string, session: any) {
    if (!uuidValidate(id))
      throw new BadRequestException(
        `The id of ${id} is not valid. try with a valid one!`,
      );
    const foundedList = await this.repo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!foundedList)
      throw new NotFoundException(`No List found with the provided id`);

    if (foundedList.archieved)
      throw new BadRequestException(
        `This list is archieved, Try to un archieve it first`,
      );
    // Ensure that the user who created the list is the one who try to delete it
    if (foundedList.user.id !== session.userId)
      throw new UnauthorizedException(
        `You don't have permission to do this action`,
      );
    return foundedList;
  }

  async createList(title: string, user: User) {
    const newList = this.repo.create({ title });
    newList.user = user;
    await this.repo.save(newList);
    return newList;
  }

  async updateList(title: string, id: string, session: any) {
    const foundedList = await this.repo.findOne({
      where: { id, archieved: false },
      relations: ['user'], // <-- this loads the user relation
      select: {
        id: true,
        title: true,
        user: {
          id: true,
          firstName: true,
        },
      },
    });
    if (!foundedList)
      throw new NotFoundException(`No List found with the provided id`);
    // Ensure that the user who created the list is the one who try to update it

    if (foundedList.user.id !== session.userId)
      throw new UnauthorizedException(
        `You don't have permission to do this update action`,
      );

    foundedList.title = title;
    await this.repo.save(foundedList);
    return foundedList;
  }

  async deleteList(id: string, session: any) {
    const foundedList = await this.repo.findOne({
      where: { id, archieved: false },
      relations: ['user'],
    });
    if (!foundedList)
      throw new NotFoundException(`No List found with the provided id`);

    // Ensure that the user who created the list is the one who try to delete it
    if (foundedList.user.id !== session.userId)
      throw new UnauthorizedException(
        `You don't have permission to do this update action`,
      );
    await this.repo.remove(foundedList);
    return { message: 'deleted Successfully' };
  }

  async getListsDueToUser(session: any) {
    const lists = await this.repo.find({
      where: {
        user: {
          id: session.userId,
        },
      },
    });
    return lists;
  }

  async getSingleList(id: string, session: any) {
    const foundedList = await this.repo.findOne({
      where: { id },
      relations: ['user'],
      select: {
        user: {
          id: true,
        },
      },
    });

    // Check if this list belongs to the logged in user

    if (!foundedList)
      throw new NotFoundException(`There is no list with the provided id`);

    if (foundedList.user.id !== session.userId)
      throw new UnauthorizedException(
        `you don't have permissions to access this list, try with another`,
      );

    return foundedList;
  }

  async updateArchieveStats(id: string, session: any) {
    if (!uuidValidate(id))
      throw new BadRequestException(
        `The id of ${id} is not valid. try with a valid one!`,
      );
    const foundedList = await this.repo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!foundedList)
      throw new NotFoundException(`No List found with the provided id`);

    if (foundedList.user.id !== session.userId)
      throw new UnauthorizedException(
        `You don't have permission to do this  action`,
      );

    foundedList.archieved = !foundedList.archieved;
    await this.repo.save(foundedList);

    if (foundedList.archieved)
      return {
        message: 'Archieved Successfully',
      };
    return {
      message: 'Unarchieved Sucessfully',
    };
  }

  async allAdminLists(session: any) {
    return await this.repo.find();
  }

  async getItemsAWithinList(session: any, id: string) {
    const foundedList = await this.checktheListCreator(id, session);
    const listWithinItems = await this.repo.findOne({
      where: { id: foundedList.id },
      relations: ['items'],
    });
    return listWithinItems;
  }
}
