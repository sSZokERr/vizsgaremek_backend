import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Projects {

    @PrimaryGeneratedColumn()
    projectId: number

    @Column()
    userId: number // melyik userhez tartozik

    @Column("longtext")
    projectData: string // szovegek a projektben
}
/*
projectData:
titles, description

{
    "titles":[
        {"elso cim"},
        {"masodik cim"},
        {"harmadik cim"}
    ],
    descriptions:[
        {"elso desc"},
        {"masodik desc"},
        {"harmadik desc"}
    ]
}

String projectData = {}


*/