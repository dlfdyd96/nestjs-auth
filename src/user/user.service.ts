import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { CreateUserRequestDto } from './dtos/create-user.dto';
import { SignInRequestDto, SignInResponseDto } from './dtos/sign-in.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(data: CreateUserRequestDto) {
    try {
      const exist = await this.userRepository.findOne({
        username: data.username,
      });
      if (exist)
        throw new BadRequestException({
          message: [`이미 존재하는 사용자입니다.`],
          error: 'Bad Request',
        });

      const user = await this.userRepository.create(data);
      await this.userRepository.save(user);
      return {
        statusCode: 201,
      };
    } catch (error) {
      console.log(error.response);
      return {
        statusCode: error.status,
        ...error.response,
      };
    }
  }

  async signIn({
    username,
    password,
  }: SignInRequestDto): Promise<SignInResponseDto> {
    try {
      const user = await this.userRepository.findOne({ username });
      if (!user) {
        throw new NotFoundException({
          error: 'Not Found',
          message: ['사용자를 찾지 못했습니다.'],
        });
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        throw new BadRequestException({
          error: 'Bad Request',
          message: ['비밀번호가 틀렸습니다.'],
        });
      }

      const token = this.jwtService.sign(user.id);
      return {
        statusCode: 201,
        token,
      };
    } catch (error) {
      return {
        statusCode: error.status,
        ...error.response,
      };
    }
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }
}
