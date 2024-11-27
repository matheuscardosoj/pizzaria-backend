import { Request, Response } from "express";
import { User } from "../models/User";
import { AppDataSource } from "../data-source";
import bcrypt from "bcrypt";

export class UserController {
    private repository = AppDataSource.getRepository(User);

    // Listar todos os usuários
    public list = async (request: Request, response: Response) => {
        try {
            const users = await this.repository.find();
            return response.json(users);
        } catch (error) {
            return response.status(500).json({ error: "Erro ao listar usuários." });
        }
    };

    // Criar um novo usuário
    public create = async (request: Request, response: Response) => {
        try {
            const { name, email, phone, address, city, state, postalCode, password, role } = request.body;

            // Verificar se todos os campos obrigatórios foram fornecidos
            if (!name || !email || !phone || !address || !city || !state || !postalCode || !password) {
                return response.status(400).json({ error: "Campos obrigatórios não fornecidos." });
            }

            // Verificar se o email já existe
            const existingUser = await this.repository.findOne({ where: { email } });
            if (existingUser) {
                console.log(existingUser, email);
                return response.status(400).json({ error: "Email já cadastrado." });
            }

            // Criptografar a senha antes de salvar
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = this.repository.create({
                name,
                email,
                phone,
                address,
                city,
                state,
                postalCode,
                password: hashedPassword,
                role: role || "consumer", // Definir o tipo padrão como "consumer"
            });

            await this.repository.save(user);

            return response.status(201).json(user);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Erro ao criar usuário." });
        }
    };

    public show = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const user = await this.repository.findOne({ where: { id: Number(id) } });

            if (!user) {
                return response.status(404).json({ error: "Usuário não encontrado." });
            }

            return response.json(user);
        } catch (error) {
            return response.status(500).json({ error: "Erro ao buscar usuário." });
        }
    };

    public delete = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const user = await this.repository.findOne({ where: { id: Number(id) } });

            if (!user) {
                return response.status(404).json({ error: "Usuário não encontrado." });
            }

            await this.repository.remove(user);

            return response.json({ message: "Usuário deletado." });
        } catch (error) {
            return response.status(500).json({ error: "Erro ao deletar usuário." });
        }
    };
}