import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import User from './user.entity';
import Image from './img.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      username: 'root',
      password: '',
      database: 'users',
      entities: [
       User, Image
      ],
      synchronize: true,
    }),
    MulterModule.register({dest: './uploads'}),
    TypeOrmModule.forFeature([User, Image]),
    JwtModule.register({
      secret: 'secret',
      signOptions: {expiresIn: '7d'}
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
