import { Router } from "express";
import { UserController } from "../controllers/UserController";

const userRoutes = Router();
const userController = new UserController();

// Rotas de usuários
userRoutes.post("/", userController.create); // Criar usuário
userRoutes.get("/", userController.list); // Listar usuários
userRoutes.get("/:id", userController.show); // Exibir usuário
userRoutes.delete("/:id", userController.delete); // Deletar usuário

export { userRoutes };