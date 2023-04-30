import { RegisterDTO } from './register.dto';
import { BadRequestException, Body, Controller, Get, HttpCode, NotFoundException, Post, Render, Res} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';
import User from './Entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {  Response, Request } from 'express';
import { Param, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common/decorators';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { FileInterceptor } from '@nestjs/platform-express';
import Image from './Entities/img.entity';
import * as multer from 'multer'
import { Storage } from '@google-cloud/storage';
import { extname } from 'path';
import { profile } from 'console';
import Projects from './Entities/projects.entity';
import base64 from 'base64-js';


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
    private jwtService: JwtService
  ) {}
  // private firebaseService: FirebaseService){}

  @Get('getImages')
    async getAllImages(){
    const imageRepo = this.dataSource.getRepository(Image);
    return await (await this.appService.findAllImages());
  }
  
  @Post('/register')
  @HttpCode(200)
  async register(@Body() registerDto: RegisterDTO, res: Response) {
    if (
      !registerDto.email ||
      !registerDto.password ||
      !registerDto.passwordAgain ||
      !registerDto.firstName ||
      !registerDto.lastName
    ) {
      throw new BadRequestException("All inputfield must be filled");
    }
    if (!registerDto.email.includes("@")) {
      throw new BadRequestException("Email must contain a @ character");
    }
    if (registerDto.password != registerDto.passwordAgain) {
      throw new BadRequestException("Passwords must match");
    }
    if (registerDto.password.length < 8) {
      throw new BadRequestException(
        "Password must be at least 8 characters long"
      );
    }

    const userRepo = this.dataSource.getRepository(User);
    const user = new User();
    const imageRepo = this.dataSource.getRepository(Image);
    const profilePicture = new Image();

    //Email check
    const email = registerDto.email;

    const emailCheck = await userRepo.findOne({ where: { email } });
    if (emailCheck) {
      throw new NotFoundException("Email is already taken");
    }
    user.email = registerDto.email;
    user.firstName = registerDto.firstName;
    user.lastName = registerDto.lastName;
    user.password = await bcrypt.hash(registerDto.password, 15);
    await userRepo.save(user);

    profilePicture.imageUrl = "https://firebasestorage.googleapis.com/v0/b/vernissage-2e8f8.appspot.com/o/0-0-0-0-default.jpg?alt=media&token=b8c49d6d-2455-473f-9c7a-583c29c0d1ff"
    profilePicture.imageType = 0;
    profilePicture.id = await this.appService.findLatestUserID()
    await imageRepo.save(profilePicture)
    return user;

  }
  @Post('login')
  async login(
    @Body("email") email: string,
    @Body("password") password: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const user = await this.appService.findOne({ email });
    if (!user) {
      throw new BadRequestException("Invalid email");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException("Invalid password");
    }
    const jwt = await this.jwtService.signAsync({
      id: user.id,
      projectsCount: user.projectsCount
    });
    response.cookie("jwt", jwt, { httpOnly: true });
    return {
      token: jwt,
    };
  }

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 200 * 1024 * 1024, // 200MB
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
            const imageRepo = this.dataSource.getRepository(Image);
            const image = new Image();
            console.log(file.originalname)
            image.id = parseInt(file.originalname.split('-')[0])
            image.imageType = parseInt(file.originalname.split('-')[1])
            image.project = parseInt(file.originalname.split('-')[2])
            image.positionInProject = parseInt(file.originalname.split('-')[3])
            image.imageUrl = await this.appService.getLastImageUrl();
            // Ha van profilkepe, akkor appService-ban updateli az uj URL-re
            if(this.appService.hasProfilePicture(image.id, image.imageUrl) && image.imageType === 0){
              imageRepo.update({id: image.id, imageType: 0},{imageUrl: image.imageUrl})
              return { message: "Profile picture updated" }
            }
            imageRepo.save(image) // egyeb irant toltse fel az adatbazisba
            resolve({ imageUrl: publicUrl });
          });
          blobStream.end(file.buffer);
        });
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    }

    @Get("getFiles")
    async getAllFiles() {
      const [files] = await bucket.getFiles();
      const fileData = await Promise.all(
        files.map(async (file) => {
          const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-17-2024',
          });
          return {
            userid: file.name.split('-')[0],
            url: url,
            imageType: file.name.split('-')[1],
            projectId: file.name.split('-')[2]
          };
        })
      );
        return fileData
    }

    @Post("getProfileDetails")
    async getProfileDetails(@Body("userid") userid: number){
      if(!await this.appService.findOne({id: userid})){
        throw new BadRequestException("No user found with this ID.")
      }

      try{
      const selectedUser = await this.appService.findOne( {id: userid} );
      const profilePictureURL = await this.appService.findProfilePictureURL(userid)
      return (
        { email: selectedUser.email,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          projectsCount: selectedUser.projectsCount,
          studies: selectedUser.studies,
          occupation: selectedUser.occupation,
          workExperience: selectedUser.workExperience,
          aboutMe: selectedUser.aboutMe,
          profilePicture: profilePictureURL[0].imageUrl
        }
      )
    }
    catch(BadRequestException){
      return
    }
  }

    @Post("updateProfileDetails")
    async updateProfileDetails(@Body("userid") userid: number,
                               @Body("updateStudies") updateStudies: string,
                               @Body("updateOccupation") updateOccupation: string,
                               @Body("updateWorkExperience") updateWorkExperience: string,
                               @Body("updateAboutMe") updateAboutMe: string){
        this.appService.updateProfileDetails(userid, updateStudies, updateOccupation, updateWorkExperience, updateAboutMe)
    }

    @Get("users")
    async getUsers(){
      const userRepo = this.dataSource.getRepository(User);
      return userRepo.find();
    }

    @Get("getProjects")
    async getProjects(){
      const projectsRepo = this.dataSource.getRepository(Projects);
      return projectsRepo.find();
    }

    @Post("newProject")
    async uploadProject(@UploadedFile() file: Express.Multer.File,
                        @Body("userid") userid: number,
                        @Body("projectData") projectData: string,
                        @Body('projectTitle') projectTitle: string){
      try{
        const userRepo = this.dataSource.getRepository(User)
        const projectRepo = this.dataSource.getRepository(Projects);
        const newProject = new Projects();
        newProject.userId = userid;
        newProject.projectData = projectData;
        newProject.projectTitle = projectTitle;
        projectRepo.save(newProject);
        const userdata = new User()
        userdata.projectsCount = await (await this.appService.findOne({id: userid})).projectsCount + 1
        userRepo.update({id: userid}, {projectsCount: userdata.projectsCount})
        return {
          message: "Upload successful!"
        }
      }
        catch (err) {
        console.log(err);
        throw new Error(err);
      }
    }

    @Post('searchUsers')
    async searchUsers(@Body('searchTerm') searchTerm: string) {
    const users = await this.appService.searchUser(searchTerm);
    return users;
  }

  @Post("uploadAndroid")
  async uploadAndroidFile(@Body("base64String") base64String: string, @Body("id") userId: number, @Body("imageType")imageType: number, @Body("project")projectCounts:number , @Body("position")position:number): Promise<{imageUrl: string}> {
    try {
      console.log("start");
      const userdata = new User();
      const buffer = Buffer.from(base64String, "base64");
      if(projectCounts <= 0){
        const fileName = userId + "-" + imageType + "-0-" + position; // Set a filename for the uploaded file
        const fileUpload = bucket.file(fileName);
        const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: "image/jpeg", // Set the content type to JPEG for example
        },
      });
      blobStream.on("error", (err) => {
        console.log(err);
        throw new Error();
      });
      return new Promise((resolve, reject) => {
        blobStream.on("finish", async () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
          const imageRepo = this.dataSource.getRepository(Image);
          const image = new Image();
          image.id = userId; // Set the ID and other properties as needed
          image.imageType = 0;
          image.project = 0;
          image.positionInProject = 0;
          image.imageUrl = await this.appService.getLastImageUrl();
          // Save the image object to the database
          imageRepo.save(image);
          resolve({ imageUrl: publicUrl });
        });
        blobStream.end(buffer);
      });
      }else {
        userdata.projectsCount = await (await this.appService.findOne({id: userId})).projectsCount
        const fileName = userId + "-" + imageType + "-" + userdata.projectsCount + "-" + position; // Set a filename for the uploaded file
        const fileUpload = bucket.file(fileName);
        const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: "image/jpeg", // Set the content type to JPEG for example
        },
      });
      blobStream.on("error", (err) => {
        console.log(err);
        throw new Error();
      });
      return new Promise((resolve, reject) => {
        blobStream.on("finish", async () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
          const imageRepo = this.dataSource.getRepository(Image);
          const image = new Image();
          image.id = userId; // Set the ID and other properties as needed
          image.imageType = 0;
          image.project = 0;
          image.positionInProject = 0;
          image.imageUrl = await this.appService.getLastImageUrl();
          // Save the image object to the database
          imageRepo.save(image);
          resolve({ imageUrl: publicUrl });
        });
        blobStream.end(buffer);
      });
    } 
  }catch (err) {
    console.log(err);
    throw new Error(err);
  }
     }


@Post("newProjectAndroid")
    async uploadAndroidProject(@Body("userid") userid: number,
                              @Body("projectData") projectData: string,
                              @Body('projectTitle') projectTitle: string){
      try{
        console.log("start new project")
        const userRepo = this.dataSource.getRepository(User)
        const projectRepo = this.dataSource.getRepository(Projects);
        const newProject = new Projects();
        newProject.userId = userid;
        newProject.projectData = projectData;
        newProject.projectTitle = projectTitle;
        projectRepo.save(newProject);
        const userdata = new User()
        userdata.projectsCount = await (await this.appService.findOne({id: newProject.userId})).projectsCount + 1
        userRepo.update({id: newProject.userId}, {projectsCount: userdata.projectsCount})
        return {
          message: "Upload successful!"
        }
      }
        catch (err) {
        console.log(err);
        throw new Error(err);
      }
    }
}
