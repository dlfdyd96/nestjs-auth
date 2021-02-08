import { IsEmail, IsOptional, IsString } from 'class-validator';
import { CommonResponseDto } from 'src/common/common.dto';

export class CreateUserRequestDto {
  @IsEmail()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  avatar = '';
}

export class CreateUserResponseDto extends CommonResponseDto {}
