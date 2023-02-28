import { RegisterDTO } from './register.dto';
import { BadRequestException, Body, Controller, Get, HttpCode, NotFoundException, Param, Patch, Post, Redirect, Render, Session } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Request, Response } from '@nestjs/common';
import { AppService } from './app.service';
import User from './user.entity';
import * as bcrypt from 'bcrypt';
import UserDataDto from './userdata.dto';
import {UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { diskStorage } from "multer";
import { randomUUID } from 'crypto';
import Path = require('path');
import { FileInterceptor} from '@nestjs/platform-express';
import { async } from 'rxjs';



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
    @Body('password') password: string
  ){
    console.log({email})
    const user = await this.appService.findOne({email});
    if(!user){
      throw new BadRequestException('Invalid email');
    }
    if(!await bcrypt.compare(password, user.password)){
      throw new BadRequestException('Invalid password');
    }
    return user;
  }
}