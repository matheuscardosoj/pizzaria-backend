import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users") // Define o nome da tabela no banco
export class User {
  @PrimaryGeneratedColumn()
  id: number; // Identificador único do usuário

  @Column()
  name: string; // Nome do usuário

  @Column({ unique: true })
  email: string; // Email (usado para login)

  @Column()
  phone: string; // Telefone

  @Column()
  address: string; // Endereço

  @Column()
  city: string; // Cidade

  @Column()
  state: string; // Estado

  @Column()
  postalCode: string; // CEP

  @Column()
  password: string; // Senha do usuário (será criptografada)

  @Column()
  role: string; // Tipo do usuário: "consumer", "admin" ou "delivery"
}