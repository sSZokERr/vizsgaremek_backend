import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Storage } from '@google-cloud/storage';
import User from './Entities/user.entity';
import Image from './Entities/img.entity';
import Projects from './Entities/projects.entity';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      username: 'root',
      password: '',
      database: 'users',
      entities: [
       User, Image, Projects
      ],
      synchronize: true,
    }),
    MulterModule.register({dest: '../public'}),
    TypeOrmModule.forFeature([User, Image, Projects]),
    JwtModule.register({
      secret: 'secret',
      signOptions: {expiresIn: '7d'}
    })
  ],
  controllers: [AppController],
  providers: [AppService, Storage],
})
export class AppModule {}
