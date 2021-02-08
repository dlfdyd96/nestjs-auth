import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from './dtos/create-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  signIn(@Body() data: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    return this.userService.signInUser(data);
  }
}
