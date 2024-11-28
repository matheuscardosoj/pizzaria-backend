import { Request, Response } from "express";
import { Produto } from "../models/produto.model";
import { AppDataSource } from "../config/data-source";
import { Categoria } from "../models/categoria.model";

export class ProdutoController {
    private repository = AppDataSource.getRepository(Produto);

    public list = async (request: Request, response: Response) => {
        try {
            const produtos = await this.repository.find({ relations: ["categoria"] });

            return response.json(produtos);
        } catch (error) {
            return response.status(500).json({ error: "Erro ao listar produtos." });
        }
    };

    public create = async (request: Request, response: Response) => {
        try {
            const { nome, preco, categoriaId } = request.body;

            if (!nome || !preco || !categoriaId) {
                return response.status(400).json({ error: "Campos obrigatórios não fornecidos." });
            }

            const categoria = await AppDataSource.getRepository(Categoria).findOne({ where: { id: categoriaId } });
            if (!categoria) {
                return response.status(404).json({ error: "Categoria não encontrada." });
            }

            const produto = this.repository.create({ nome, preco, categoria });
            await this.repository.save(produto);

            return response.status(201).json(produto);
        } catch (error) {
            return response.status(500).json({ error: "Erro ao criar produto." });
        }
    };

    public show = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            const produto = await this.repository.findOne({ where: { id: Number(id) }, relations: ["categoria"] });

            if (!produto) {
                return response.status(404).json({ error: "Produto não encontrado." });
            }

            return response.json(produto);
        } catch (error) {
            return response.status(500).json({ error: "Erro ao buscar produto." });
        }
    };

    public update = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const { nome, preco, categoriaId } = request.body;

            if (!nome && !preco && !categoriaId) {
                return response.status(400).json({ error: "Nenhum campo fornecido para atualização." });
            }

            const produto = await this.repository.findOne({ where: { id: Number(id) } });
            if (!produto) {
                return response.status(404).json({ error: "Produto não encontrado." });
            }

            produto.nome = nome;
            produto.preco = preco;

            const categoria = await AppDataSource.getRepository(Categoria).findOne({ where: { id: categoriaId } });

            if (!categoria) {
                return response.status(404).json({ error: "Categoria não encontrada." });
            }

            produto.categoria = categoria;

            await this.repository.save(produto);

            return response.json(produto);
        } catch (error) {
            return response.status(500).json({ error: "Erro ao atualizar produto." });
        }
    };

    public delete = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            const produto = await this.repository.findOne({ where: { id: Number(id) } });

            if (!produto) {
                return response.status(404).json({ error: "Produto não encontrado." });
            }

            await this.repository.remove(produto);

            return response.json({ message: "Produto deletado." });
        } catch (error) {
            return response.status(500).json({ error: "Erro ao deletar produto." });
        }
    };
}
