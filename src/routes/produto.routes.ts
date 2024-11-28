import { Router } from "express";
import { ProdutoController } from "../controllers/produto.controller";

const router = Router();
const produtoController = new ProdutoController();

router.get("/", produtoController.list);
router.post("/", produtoController.create);
router.get("/:id", produtoController.show);
router.put("/:id", produtoController.update);
router.delete("/:id", produtoController.delete);

export default router;
