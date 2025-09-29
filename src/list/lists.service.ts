import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class ListsService {
  constructor(@InjectRepository(List) private repo: Repository<List>) {}

  async createList(title: string, user: User) {
    const newList = this.repo.create({ title });
    newList.user = user;
    await this.repo.save(newList);
    return newList;
  }

  async updateList(title: string, id: string, session: any) {
    const foundedList = await this.repo.findOne({
      where: { id },
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
      where: { id },
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

    console.log(foundedList);
    // Check if this list belongs to the logged in user

    if (!foundedList)
      throw new NotFoundException(`There is no list with the provided id`);

    if (foundedList.user.id !== session.userId)
      throw new UnauthorizedException(
        `you don't have permissions to access this list, try with another`,
      );

    return foundedList;
  }
}
