import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    password: string
    
    @Column()
    firstName: string
    
    @Column()
    lastName: string

    @Column()
    projectsCount: number

    @Column()
    studies: string

    @Column()
    occupation: string

    @Column()
    workExperience: string

    @Column()
    aboutMe: string

}