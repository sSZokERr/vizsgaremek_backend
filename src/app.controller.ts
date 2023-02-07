import { RegisterDTO } from './register.dto';
import { BadRequestException, Body, Controller, Get, HttpCode, Param, Patch, Post, Render } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';
import User from './user.entity';
import * as bcrypt from 'bcrypt'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private dataSource: DataSource,
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
  async register(@Body() registerDto: RegisterDTO){
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
    user.email = registerDto.email;
    user.firstName = registerDto.firstName;
    user.lastName = registerDto.lastName;
    user.password = await bcrypt.hash(registerDto.password, 15)
    await userRepo.save(user)
    
    return user
  }
  

  
}
