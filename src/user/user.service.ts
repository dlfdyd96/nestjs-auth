import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserRequestDto } from './dtos/create-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signInUser(data: CreateUserRequestDto) {
    try {
      const exist = await this.userRepository.findOne({
        username: data.username,
      });
      if (exist)
        throw new BadRequestException({
          message: `이미 존재하는 사용자입니다.`,
        });

      const user = await this.userRepository.create(data);
      await this.userRepository.save(user);
      return {
        status: 201,
      };
    } catch (error) {
      console.log(error);
      return {
        status: error.status,
        error: error.message,
      };
    }
  }
}
