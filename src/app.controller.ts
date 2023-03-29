import { RegisterDTO } from './register.dto';
import { BadRequestException, Body, Controller, Get, HttpCode, NotFoundException, Post, Render, Res} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';
import User from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {  Response, Request } from 'express';
import { Req, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import Image from './img.entity';



@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private dataSource: DataSource,
    private jwtService: JwtService){}

  @Get('getImages')
    async getAllImages() {
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
      user.registrationDate = new Date();
      user.password = await bcrypt.hash(registerDto.password, 15)
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
    const jwt = await this.jwtService.signAsync({id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName});
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
      destination: './uploads',
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
    return 'File uploaded'
  }
  
  
}