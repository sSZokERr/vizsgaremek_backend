import { RegisterDTO } from './register.dto';
import { BadRequestException, Body, Controller, Get, HttpCode, NotFoundException, Post, Render, Res} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';
import User from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {  Response, Request } from 'express';
import { Param, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common/decorators';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { FileInterceptor } from '@nestjs/platform-express';
import Image from './img.entity';
import * as multer from 'multer'
import { Storage } from '@google-cloud/storage';
import { extname } from 'path';

const storage = new Storage({
  projectId: 'vernissage-2e8f8',
  keyFilename: './src/ServiceAccountKey/vernissageAdminSDK.json', 
})

const bucket = storage.bucket('vernissage-2e8f8.appspot.com')

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private dataSource: DataSource,
    private jwtService: JwtService){}

  @Get('getImages')
    async getAllImages(){
    const imageRepo = this.dataSource.getRepository(Image);
    return await (await this.appService.findAllImages());
  }

  @Get('getImages/:id')
    async getImagesById(@Param('id') id: number): Promise<Image[]> {
    const imageRepo = this.dataSource.getRepository(Image);
    const imagesObject = await this.appService.findAllImages();
    const images = Array.isArray(imagesObject) ? imagesObject : Object.values(imagesObject);
    return images.filter(image => image.id === id);
}
  
  @Post('/register')
  @HttpCode(200)
  async register(@Body() registerDto: RegisterDTO, res: Response){
    if(!registerDto.email || !registerDto.password || !registerDto.passwordAgain || !registerDto.firstName || !registerDto.lastName){
      throw new BadRequestException('All inputfield must be filled')
    }
    if(!registerDto.email.includes('@')){
      throw new BadRequestException('Email must contain a @ character')
    }
    if(registerDto.password != registerDto.passwordAgain){
      throw new BadRequestException('Passwords must match')
    }
    if(registerDto.password.length < 8){
      throw new BadRequestException('Password must be at least 8 characters long')
    }

    const userRepo = this.dataSource.getRepository(User)
    const user = new User()

    //Email check
    const email = registerDto.email
    
    const emailCheck = await userRepo.findOne({where: {email}})
    if(emailCheck){
      throw new NotFoundException('Email is already taken')
    }else {
      user.email = registerDto.email;
      user.firstName = registerDto.firstName;
      user.lastName = registerDto.lastName;
      user.password = await bcrypt.hash(registerDto.password, 15)
      user.profilePicture = "default_profile_picture.jpg"
      await userRepo.save(user)
      
      return user
    }
  }


  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({passthrough: true}) response: Response
  ){
    console.log({email})
    const user = await this.appService.findOne({email});
    if(!user){
      throw new BadRequestException('Invalid email');
    }
    if(!await bcrypt.compare(password, user.password)){
      throw new BadRequestException('Invalid password');
    }
    const jwt = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      studies: user.studies,
      occupation: user.occupation,
      workExperience: user.workExperience,
      aboutMe: user.aboutMe});
    response.cookie('jwt', jwt, {httpOnly: true});
    return {
      token: jwt
    };
  }


  @Get('user')
  async user(@Req() request: Request) {
    try{
     const cookie = request.cookies['jwt'];
     const data = await this.jwtService.verifyAsync(cookie)
     if(!data){
      throw new UnauthorizedException();
     }
     const user = await this.appService.findOne({id: data['id']})
     const {password, ...result} = user;

     return result;
    }catch(e) {
      throw new UnauthorizedException();
    }
  }
  @Post('logout')
  async logout(@Res({passthrough: true}) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'Logged out'
    }
  }
  
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
      },
      preservePath: true,
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File,
                     @Body() body: any): Promise<{imageUrl: string}> {
      try {
        const fileName = file.originalname + extname(file.originalname);
        const fileUpload = bucket.file(fileName);
  
        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });
  
        blobStream.on('error', (err) => {
          console.log(err);
          throw new Error();
        });
  
        return new Promise((resolve, reject) => {
          blobStream.on('finish', async () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
            resolve({ imageUrl: publicUrl });
            const imageRepo = this.dataSource.getRepository(Image)
            const image = new Image()
            image.id = parseInt(file.originalname.split('-')[0]);
            image.imageUrl = await this.appService.getLastImageUrl();
            await imageRepo.save(image);
          });
          blobStream.end(file.buffer);
        });
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    }


    @Post("getFiles")
    async getAllFiles() {
      const [files] = await bucket.getFiles();
      const fileData = await Promise.all(
        files.map(async (file) => {
          const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-17-2025',
          });
          return {
            userid: file.name.split('-')[0],
            url: url,
          };
        })
      );
        return fileData
    }
  }

  
