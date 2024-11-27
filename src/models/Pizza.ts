import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("pizzas") // Nome da tabela no banco de dados
export class Pizza {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column("decimal")
  price?: number;

  @Column()
  size?: string;
}