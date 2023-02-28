import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import User from './user.entity';
import {Repository} from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ){}
  async findOne(condition: any): Promise<User> {
    console.log('appService: ', condition)
    return this.userRepo.findOneBy(condition)
  }
}
