import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Item) private readonly Itemrepo: Repository<Item>,
    private mailService: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async schedulesTasks() {
    const lists = await this.Itemrepo.find({
      relations: ['list', 'list.user'],
    });

    //lists[0].list.user.email
    const expiresItems: Item[] = [];
    const expiresInOneHour = new Date(Date.now() + 60 * 60 * 1000);
    for (const item of lists as Item[]) {
      if (!item.dueDate) continue;
      if (item?.dueDate >= new Date() && item.dueDate <= expiresInOneHour) {
        expiresItems.push(item);
      } else {
        item.expired = true;
      }
    }

    for (const item of expiresItems) {
      this.sendMail(
        `In the list of '${item.list.title}' the task  '${item.title}' will expire within 60 min, hurry up`,
        item?.list?.user?.email,
      );
    }
  }

  sendMail(task: string, email: string) {
    const message = `Task ${task} will expire within one hour, hurry up!`;
    this.mailService.sendMail({
      from: 'Zeyad albadawy <zeyadalbadawyamm@gmail.com>',
      to: email,
      subject: `Task expires soon`,
      text: message,
    });
  }
}
