import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import User from './user.entity';
import {Repository} from 'typeorm';
import Image from './img.entity';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Image) private readonly imageRepo: Repository<Image>,
    private readonly storage: Storage
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

  async findProfilePicture(id : any): Promise<User>{
    const profilePicture = await this.userRepo.query(`SELECT \`profilePicture\` FROM \`user\` WHERE id = ${id}`)
    const profilePictureJson = JSON.parse(JSON.stringify(profilePicture))
    return profilePictureJson
  }
  

  }