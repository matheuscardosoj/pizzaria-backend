import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";
import bcrypt from "bcrypt";

@Entity("usuarios")
export class Usuario {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	nome: string;

	@Column({ unique: true })
	email: string;

	@Column()
	telefone: string;

	@Column()
	endereco: string;

	@Column()
	senha: string;

	@Column()
	funcao: string;

	@BeforeInsert()
	async hashSenha() {
		this.senha = await bcrypt.hash(this.senha, 10);
	}

	async checkSenha(password: string): Promise<boolean> {
		return await bcrypt.compare(password, this.senha);
	}
}
