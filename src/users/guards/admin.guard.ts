import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly repo: UserService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const foundedUser = await this.repo.findOne(request.session.userId);
    return foundedUser?.isAdmin ? true : false;
  }
}
