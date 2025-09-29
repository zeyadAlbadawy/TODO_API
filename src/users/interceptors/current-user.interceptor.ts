import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    // Run before the request hit the router
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session;

    const foundedUser = await this.userService.findOne(userId);
    if (!foundedUser) return next.handle();
    request.CurrentUser = foundedUser;

    return next.handle();
  }
}
