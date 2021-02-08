import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from './dtos/create-user.dto';
import { SignInRequestDto, SignInResponseDto } from './dtos/sign-in.dto';
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
}
