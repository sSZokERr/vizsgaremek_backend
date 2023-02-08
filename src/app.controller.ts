import { RegisterDTO } from './register.dto';
import { BadRequestException, Body, Controller, Get, HttpCode, Param, Patch, Post, Redirect, Render, Session } from '@nestjs/common';
import { DataSource, Repository, getRepository } from 'typeorm';
import { Request, Response } from '@nestjs/common';
import { AppService } from './app.service';
import User from './user.entity';
import * as bcrypt from 'bcrypt'
import UserDataDto from './userdata.dto';

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

  @Get('/logout')
  @Redirect()
  logout(@Session() session: Record<string, any>) {
    session.user_id = null;
    return { url: '/' };
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
      throw new BadRequestException('Email is already taken')
    }else {
      user.email = registerDto.email;
      user.firstName = registerDto.firstName;
      user.lastName = registerDto.lastName;
      user.password = await bcrypt.hash(registerDto.password, 15)
      await userRepo.save(user)
      
      return user
    }
    
  }
  @Get('/login')
  @Render('login')
  loginForm() {
    return {};
  }

  @Post('/login')
  @HttpCode(200)
  async logIn(@Body() userData: UserDataDto, res: Response, req: Request){
    const userRepo = this.dataSource.getRepository(User)

    const email = userData.email;
    const password = userData.password;
    const selectPassword = await userRepo.findOne({select: {password: true}, where: {email: email}})
    console.log(selectPassword)
    bcrypt.compare(password, selectPassword, ()=>{console.log('asd')})

  }


  
}
