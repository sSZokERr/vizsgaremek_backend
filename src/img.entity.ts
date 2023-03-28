import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Image {

    @PrimaryGeneratedColumn()
    primary: number

    @Column()
    id: number

    @Column()
    imageUrl: string
}