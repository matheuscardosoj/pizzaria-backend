import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.controller";

const router = Router();
const categoriaController = new CategoriaController();

router.get("/", categoriaController.list);
router.post("/", categoriaController.create);
router.get("/:id", categoriaController.show);
router.put("/:id", categoriaController.update);
router.delete("/:id", categoriaController.delete);

export default router;
