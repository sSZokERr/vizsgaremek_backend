import { RegisterDTO } from './register.dto';
import { BadRequestException, Body, Controller, Get, HttpCode, NotFoundException, Post, Render, Res} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';
import User from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {  Response, Request } from 'express';
import { Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common/decorators';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import Image from './img.entity';
import { GoogleDriveService } from './googleDriveService';
import * as path from 'path';
import * as fs from 'fs';

const dotenv = require("dotenv")

dotenv.config();
console.log(process.env.GOOGLE_DRIVE_CLIENT_ID);
console.log(process.env.GOOGLE_DRIVE_CLIENT_SECRET);
console.log(process.env.GOOGLE_DRIVE_REDIRECT_URI);
console.log(process.env.GOOGLE_DRIVE_REFRESH_TOKEN);


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
    const jwt = await this.jwtService.signAsync({id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, studies: user.studies, occupation: user.occupation, workExperience: user.workExperience, aboutMe: user.aboutMe});
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
  
  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './public',
      filename: (req, file, callback) => {
        const filename = `${file.originalname}`
        callback(null, filename)
      }
    })
  }))
  async handleUpload(@UploadedFile() file: Express.Multer.File) {
    const imageRepo = this.dataSource.getRepository(Image)
    const imageUp = new Image()
    imageUp.imageUrl = file.originalname
    imageUp.id = parseInt(file.originalname.split('-')[0])
    await imageRepo.save(imageUp)

      const googleDriveService = new GoogleDriveService(
       '70780256000-kjlnf28ujenpdt0731k01qia5pl0mgrf.apps.googleusercontent.com',
       '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',
       'https://developers.google.com/oauthplayground',
       '1//04hX_2ymtB-vvCgYIARAAGAQSNwF-L9IrZe4UVhJGaIdEx8PSXV3MenvSPQfAiA7Rf3iVAJe-cWyi5BQdEKyUpTJk_6VjeQKOE3w'
       );
      console.log(file.originalname)
      const finalPath = path.resolve(__dirname, `../public/${file.originalname}`);
      console.log(finalPath)
      const folderName = 'vizsgaremek';
    
      if (!fs.existsSync(finalPath)) {
        throw new Error('File not found!');
      }
    
      let folder = await googleDriveService.searchFolder(folderName).catch((error) => {
        console.error(error);
        return null;
      });
    
      if (!folder) {
        folder = await googleDriveService.createFolder(folderName);
      }
    
      await googleDriveService.saveFile(file.originalname, finalPath, 'image/jpg', folder.id).catch((error) => {
        console.error(error);
      });
    
      console.info('File uploaded successfully!');
      console.log(folder)
      // Delete the file on the server
      fs.unlinkSync(finalPath);

    return 'File uploaded'
  }
  
  @Post('profilePicture/:id')
    async getProfilePicture(id: number){
      const profilepicture = this.dataSource.getRepository(User);
      return await (await this.appService.findProfilePicture(id));
    }
  
}