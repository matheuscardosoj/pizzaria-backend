import { Request, Response } from "express";
import { Categoria } from "../models/categoria.model";
import { AppDataSource } from "../config/data-source";

export class CategoriaController {
    private repository = AppDataSource.getRepository(Categoria);

    public list = async (request: Request, response: Response) => {
        try {
            const categorias = await this.repository.find();

            return response.json(categorias);
        } catch (error) {
            return response.status(500).json({ error: "Erro ao listar categorias." });
        }
    };

    public create = async (request: Request, response: Response) => {
        try {
            const { nome } = request.body;

            if (!nome) {
                return response.status(400).json({ error: "Nome é obrigatório." });
            }

            const categoria = this.repository.create({ nome });
            await this.repository.save(categoria);

            return response.status(201).json(categoria);
        } catch (error) {
            return response.status(500).json({ error: "Erro ao criar categoria." });
        }
    };

    public show = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            const categoria = await this.repository.findOne({ where: { id: Number(id) } });

            if (!categoria) {
                return response.status(404).json({ error: "Categoria não encontrada." });
            }

            return response.json(categoria);
        } catch (error) {
            return response.status(500).json({ error: "Erro ao buscar categoria." });
        }
    };

    public update = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const { nome } = request.body;

            const categoria = await this.repository.findOne({ where: { id: Number(id) } });

            if (!categoria) {
                return response.status(404).json({ error: "Categoria não encontrada." });
            }

            categoria.nome = nome || categoria.nome;
            await this.repository.save(categoria);

            return response.json(categoria);
        } catch (error) {
            return response.status(500).json({ error: "Erro ao atualizar categoria." });
        }
    };

    public delete = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            const categoria = await this.repository.findOne({ where: { id: Number(id) } });

            if (!categoria) {
                return response.status(404).json({ error: "Categoria não encontrada." });
            }

            await this.repository.remove(categoria);

            return response.json({ message: "Categoria deletada." });
        } catch (error) {
            return response.status(500).json({ error: "Erro ao deletar categoria." });
        }
    };
}
