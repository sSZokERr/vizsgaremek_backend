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

  async findLatestUserID(): Promise<number> {
    const latestUserID = await this.userRepo.query("SELECT MAX(id) as latestUserID FROM user;")
    return latestUserID[0].latestUserID
  }
  async updateProfileDetails(id: number,
                             updateStudies: string,
                             updateOccupation: string,
                             updateWorkExperience: string,
                             updateAboutMe: string): Promise<string> {
    await this.userRepo.update({
      id: id,
    }, {
      studies: updateStudies,
    });
    await this.userRepo.update({
      id: id,
    },{
        occupation: updateOccupation
    });
    await this.userRepo.update({
      id: id,
    },{
        workExperience: updateWorkExperience
    });
    await this.userRepo.update({
      id: id,
    },{
        aboutMe: updateAboutMe
    });
    
    return
  }
  async findAllImages(): Promise<Image> {
    const images = await this.imageRepo.find();
    const imageArray = JSON.parse(JSON.stringify(images))
    return imageArray;
  }

  async findProfilePictureURL(id : number): Promise<Image>{
    const profilePictureURL = await
      this.imageRepo.query(`
        SELECT imageUrl FROM image WHERE id = ${id} AND imageType = 0;`
      )
    return profilePictureURL
  }
  async hasProfilePicture(id: number, newImageURL: string): Promise<boolean>{
    if(this.imageRepo.query(`SELECT id FROM image WHERE id = ${id};`)){
      this.imageRepo.update({id: id},{imageUrl: newImageURL})
      return true;
    }
    return false
  }
  async getLastImageUrl(): Promise<string> {
    const storage = new Storage({
       projectId: 'vernissage-2e8f8',
      keyFilename: './src/ServiceAccountKey/vernissageAdminSDK.json',
    });
  
    const bucketName = storage.bucket('vernissage-2e8f8.appspot.com');
    const [files] = await bucketName.getFiles();
  
    if (files.length === 0) {
      throw new Error('No files found in the images/ folder');
    }
  
    const fileData = await Promise.all(
      files.map(async (file) => {
        const [metadata] = await file.getMetadata();
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: '03-17-2025',
        });
        return {
          name: file.name,
          timeCreated: metadata.timeCreated,
          url: url,
        };
      })
    );
  
    fileData.sort((a, b) => {
      const timeA = new Date(a.timeCreated).getTime();
      const timeB = new Date(b.timeCreated).getTime();
      return timeB - timeA;
    });
  
    const lastLink = fileData[0].url;
    console.log("public last url: " + lastLink);
    return lastLink;
    }

  }
  