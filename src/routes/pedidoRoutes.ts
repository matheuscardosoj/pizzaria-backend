import { Router } from "express";
import { PedidoController } from "../controllers/PedidoController";

const pedidoRoutes = Router();
const pedidoController = new PedidoController();

// Rotas de pedidos
pedidoRoutes.post("/", pedidoController.create); // Criar pedido
pedidoRoutes.get("/", pedidoController.list);    // Listar pedidos
pedidoRoutes.get("/:id", pedidoController.show); // Exibir pedido
pedidoRoutes.delete("/:id", pedidoController.delete); // Deletar pedido
pedidoRoutes.put("/:id/status", pedidoController.updateStatus); // Atualizar status do pedido

export { pedidoRoutes };