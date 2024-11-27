import { Request, Response } from "express";
import { Pedido } from "../models/Pedido";
import { AppDataSource } from "../data-source";

export class PedidoController {
    private repository = AppDataSource.getRepository(Pedido);

    // Listar todos os pedidos
    public list = async (request: Request, response: Response) => {
        try {
            const pedidos = await this.repository.find({ relations: ["user", "pizza"] });
            return response.json(pedidos);
        } catch (error) {
            return response.status(500).json({ message: "Erro ao listar pedidos.", error });
        }
    };

    // Criar um novo pedido
    public create = async (request: Request, response: Response) => {
        try {
            const { user_id, pizza_id, status, total, paymentMethod, deliveryMethod, changeAmount } = request.body;

            const pedido = this.repository.create({
                user: { id: user_id },
                pizza: { id: pizza_id },
                status,
                total,
                paymentMethod,
                deliveryMethod,
                changeAmount,
            });

            await this.repository.save(pedido);

            return response.status(201).json(pedido);
        } catch (error) {
            return response.status(500).json({ message: "Erro ao criar pedido.", error });
        }
    };

    public show = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const pedido = await this.repository.findOne({ where: { id: Number(id) }, relations: ["user", "pizza"] });

            if (!pedido) {
                return response.status(404).json({ message: "Pedido não encontrado." });
            }

            return response.json(pedido);
        } catch (error) {
            return response.status(500).json({ message: "Erro ao buscar pedido.", error });
        }
    };

    public delete = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const pedido = await this.repository.findOne({ where: { id: Number(id) } });

            if (!pedido) {
                return response.status(404).json({ message: "Pedido não encontrado." });
            }

            await this.repository.remove(pedido);

            return response.status(204).json({ message: "Pedido deletado." });
        } catch (error) {
            return response.status(500).json({ message: "Erro ao deletar pedido.", error });
        }
    };

    // Alterar o status de um pedido
    public updateStatus = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const { status } = request.body;

            // Validar se o status é um dos valores válidos
            const validStatuses = ["pendente", "recebido", "em preparação", "em trânsito", "entregue", "cancelado"];
            if (!validStatuses.includes(status)) {
                return response.status(400).json({ message: "Status inválido." });
            }

            const pedido = await this.repository.findOne({ where: { id: Number(id) } });

            if (!pedido) {
                return response.status(404).json({ message: "Pedido não encontrado." });
            }

            pedido.status = status;
            await this.repository.save(pedido);

            return response.status(200).json(pedido);
        } catch (error) {
            return response.status(500).json({ message: "Erro ao atualizar status do pedido.", error });
        }
    };
}