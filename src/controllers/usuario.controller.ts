import { Request, Response } from "express";
import { Usuario } from "../models/usuario.model";
import { AppDataSource } from "../config/data-source";
import bcrypt from "bcrypt";

export class UserController {
    private repository = AppDataSource.getRepository(Usuario);

    public list = async (request: Request, response: Response) => {
        try {
            const users = await this.repository.find();
            return response.json(users);
        } catch (error) {
            return response.status(500).json({ error: "Erro ao listar usuários." });
        }
    };

    public create = async (request: Request, response: Response) => {
        try {
            const { nome, email, telefone, endereco, senha, funcao } = request.body;

            const funcoesValidas = ["cliente", "admin"];

            if (!nome || !email || !telefone || !endereco || !senha || !funcao) {
                return response.status(400).json({ error: "Campos obrigatórios não fornecidos." });
            }

            if (!funcoesValidas.includes(funcao)) {
                return response.status(400).json({ error: "Função inválida." });
            }

            const existingUser = await this.repository.findOne({ where: { email } });
            if (existingUser) {
                return response.status(400).json({ error: "Email já cadastrado." });
            }

            const hashedSenha = await bcrypt.hash(senha, 10);

            const user = this.repository.create({
                nome,
                email,
                telefone,
                endereco,
                senha: hashedSenha,
                funcao: funcao || "cliente",
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

    public update = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const { nome, email, telefone, endereco, senha, funcao } = request.body;

            const funcoesValidas = ["cliente", "admin"];

            if (!nome || !email || !telefone || !endereco || !senha || !funcao) {
                return response.status(400).json({ error: "Campos obrigatórios não fornecidos." });
            }

            if (!funcoesValidas.includes(funcao)) {
                return response.status(400).json({ error: "Função inválida." });
            }

            const user = await this.repository.findOne({ where: { id } });
            if (!user) {
                return response.status(404).json({ error: "Usuário não encontrado." });
            }

            if (nome) user.nome = nome;
            if (email) user.email = email;
            if (telefone) user.telefone = telefone;
            if (endereco) user.endereco = endereco;
            if (senha) user.senha = await bcrypt.hash(senha, 10);
            if (funcao) user.funcao = funcao;

            await this.repository.save(user);

            return response.json(user);
        } catch (error) {
            return response.status(500).json({ error: "Erro ao atualizar usuário." });
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
