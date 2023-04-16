import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Projects {

    @PrimaryGeneratedColumn()
    primary: number

    @Column("longtext")
    projectData: string
}
/*
projectData:
titles, description, userId
*/