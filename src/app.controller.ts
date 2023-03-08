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
import { extname } from 'path';



@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private dataSource: DataSource,
    private jwtService: JwtService
  ) {}


  @Get()
  @Render('index')
  index() {
    return { message: 'Welcome to the homepage' };
  }

  @Get('/register')
  @Render('register')
  registerPage() {
    return { message: 'Welcome to the register page' };
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
    const jwt = await this.jwtService.signAsync({id: user.id});
    response.cookie('jwt', jwt, {httpOnly: true});
    return {
      message: 'Logged in'
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
        const uniqueSuffix = 
          Date.now() + '-' + Math.round(Math.random() * 1e9)
        const extension = extname(file.originalname)
        const filename = `${file.originalname}-${uniqueSuffix}${extension}`
        callback(null, filename)
      }
    })
  }))
  handleUpload(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file)
    return 'File upload'
  }
}