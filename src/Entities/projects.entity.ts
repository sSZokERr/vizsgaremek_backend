import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Projects {

    @PrimaryGeneratedColumn()
    projectId: number

    @Column()
    userId: number // melyik userhez tartozik

    @Column()
    projectTitle: string
    
    @Column("longtext")
    projectData: string // szovegek a projektben
}
/*
projectData:
titles, description

{
    "descriptions":
        ["desc1"],
        ["desc2"]
    "titles":
        ["title1"],
        ["title2"]
} 


String projectData = {}


*/