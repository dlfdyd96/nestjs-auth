import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/roles.guard';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from './dtos/create-user.dto';
import { SignInRequestDto, SignInResponseDto } from './dtos/sign-in.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  signUp(@Body() data: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    return this.userService.signUp(data);
  }

  @Post('/sign-in')
  signIn(@Body() data: SignInRequestDto): Promise<SignInResponseDto> {
    return this.userService.signIn(data);
  }

  @Get('/me')
  @Role(['Any'])
  // @UseGuards(AuthGuard)
  getMe(@AuthUser() user: User): User {
    return user;
  }

  @Get('/admin')
  @Role(['Admin'])
  // @UseGuards(AuthGuard)
  getAdminInfo(@AuthUser() user: User) {
    return `Admin : ${user.username}`;
  }
}
