import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id!: number; // Agregamos el !

  @Column()
  titulo!: string; // Agregamos el !

  @Column()
  autor!: string; // Agregamos el !

  @Column({ default: 0 })
  paginasLeidas!: number; // Agregamos el !

  @Column({ default: false })
  terminado!: boolean; // Agregamos el !
}