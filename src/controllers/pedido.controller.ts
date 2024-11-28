import { Request, Response } from "express";
import { Pedido } from "../models/pedido.model";
import { PedidoProduto } from "../models/pedido_produto.model";
import { Produto } from "../models/produto.model";
import { Usuario } from "../models/usuario.model";
import { AppDataSource } from "../config/data-source";

export default class PedidoController {
    private repository = AppDataSource.getRepository(Pedido);
    private produtoRepository = AppDataSource.getRepository(Produto);
    private pedidoProdutoRepository = AppDataSource.getRepository(PedidoProduto);
    private usuarioRepository = AppDataSource.getRepository(Usuario);

    public list = async (request: Request, response: Response) => {
        try {
            const pedidos = await this.repository.find({
                relations: {
                    produtos: {
                        produto: true,
                    },
                    idUsuario: true,
                },
            });
            return response.json(pedidos);
        } catch (error) {
            console.error("Erro ao listar pedidos:", error);
            return response.status(500).json({ message: "Erro ao listar pedidos.", error });
        }
    };

    public create = async (request: Request, response: Response) => {
        try {
            const { idUsuario, produtos, status, formaDePagamento, tipoDeEntrega } = request.body;

            const statusValidos = ["pendente", "recebido", "em preparação", "em trânsito", "entregue", "cancelado"];
            const formaDePagamentoValidas = ["dinheiro", "cartão"];
            const tipoDeEntregaValidos = ["retirada", "entrega"];

            if (!idUsuario || !produtos || !status || !formaDePagamento || !tipoDeEntrega) {
                return response.status(400).json({ message: "Campos obrigatórios não fornecidos." });
            }

            if (!statusValidos.includes(status)) {
                return response.status(400).json({ message: "Status inválido." });
            }

            if (!formaDePagamentoValidas.includes(formaDePagamento)) {
                return response.status(400).json({ message: "Forma de pagamento inválida." });
            }

            if (!tipoDeEntregaValidos.includes(tipoDeEntrega)) {
                return response.status(400).json({ message: "Tipo de entrega inválido." });
            }

            if (!Array.isArray(produtos) || produtos.length === 0) {
                return response.status(400).json({ message: "Produtos não enviados." });
            }

            const usuario = await this.usuarioRepository.findOne({ where: { id: idUsuario } });
            if (!usuario) {
                return response.status(404).json({ message: "Usuário não encontrado." });
            }

            const produtosValidos = await Promise.all(
                produtos.map(async (produto: any) => {
                    const produtoValido = await this.produtoRepository.findOne({ where: { id: produto.id } });
                    if (!produtoValido) {
                        return null;
                    }
                    return { produto: produtoValido, quantidade: produto.quantidade };
                })
            );

            if (produtosValidos.some((p: any) => !p)) {
                return response.status(400).json({ message: "Produtos inválidos." });
            }

            const total = produtosValidos.reduce(
                (acc: number, item: any) => acc + item.produto.preco * item.quantidade,
                0
            );

            const pedido = this.repository.create({
                idUsuario: usuario,
                status,
                total,
                formaDePagamento,
                tipoDeEntrega,
                produtos: produtosValidos.map((item: any) => ({
                    produto: item.produto,
                    quantidade: item.quantidade,
                })),
            });

            await this.repository.save(pedido);

            return response.status(201).json(pedido);
        } catch (error) {
            console.error("Erro ao criar pedido:", error);
            return response.status(500).json({ message: "Erro ao criar pedido.", error });
        }
    };


    public show = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            const pedido = await this.repository.findOne({
                where: { id: Number(id) },
                relations: {
                    produtos: {
                        produto: true,
                    },
                    idUsuario: true,
                },
            });

            if (!pedido) {
                return response.status(404).json({ message: "Pedido não encontrado." });
            }

            return response.json(pedido);
        } catch (error) {
            console.error("Erro ao buscar pedido:", error);
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

            const pedidoProdutos = await this.pedidoProdutoRepository.find({ where: { pedido: pedido } });
            await this.pedidoProdutoRepository.remove(pedidoProdutos);

            await this.repository.remove(pedido);

            return response.status(204).json({ message: "Pedido deletado com sucesso." });
        } catch (error) {
            console.error("Erro ao deletar pedido:", error);
            return response.status(500).json({ message: "Erro ao deletar pedido.", error });
        }
    };

    public updateStatus = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const { status } = request.body;

            const statusValidos = ["pendente", "recebido", "em preparação", "em trânsito", "entregue", "cancelado"];

            if (!statusValidos.includes(status)) {
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
            console.error("Erro ao atualizar status do pedido:", error);
            return response.status(500).json({ message: "Erro ao atualizar status do pedido.", error });
        }
    };
}
