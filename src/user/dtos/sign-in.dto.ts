import { IsEmail, IsString } from 'class-validator';
import { CommonResponseDto } from 'src/common/common.dto';

export class SignInRequestDto {
  @IsEmail()
  username: string;

  @IsString()
  password: string;
}

export class SignInResponseDto extends CommonResponseDto {
  token: string;
}
