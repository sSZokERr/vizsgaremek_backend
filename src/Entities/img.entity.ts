import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Image {

    @PrimaryGeneratedColumn()
    primary: number

    @Column()
    id: number

    @Column()
    imageType: number // 0 - profil, 1 - projekt cover, 2 - projekt kep

    @Column()
    project: number // n - hanyadik projekt

    @Column()
    positionInProject: number // n - hanyadik kep a projektben 

    @Column("longtext")
    imageUrl: string
}