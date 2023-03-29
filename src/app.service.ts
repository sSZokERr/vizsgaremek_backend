import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import User from './user.entity';
import {Repository} from 'typeorm';
import Image from './img.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Image) private readonly imageRepo: Repository<Image>
  ){}
  async findOne(condition: any): Promise<User> {
    console.log('appService: ', condition)
    return this.userRepo.findOneBy(condition)
  }

  async findAllImages(): Promise<Image> {
    const images = await this.imageRepo.find();
    const imageArray = JSON.parse(JSON.stringify(images))
    return imageArray;
  }
}
