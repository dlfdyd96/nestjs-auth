import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/user/entity/user.entity';
import { AllowedRoles } from './roles.guard';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    console.log(requiredRoles);
    const request = context.switchToHttp().getRequest();
    const user: User = request['user'];
    if (!user) return false;
    // return true;
    if (requiredRoles.includes('Any')) return true;
    return requiredRoles.includes(user.role);
  }
}
