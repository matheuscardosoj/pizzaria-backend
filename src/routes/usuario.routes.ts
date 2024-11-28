import { Router } from "express";
import { UserController } from "../controllers/usuario.controller";

const router = Router();
const userController = new UserController();

router.post("/", userController.create);
router.get("/", userController.list);
router.get("/:id", userController.show);
router.delete("/:id", userController.delete);
router.put("/:id", userController.update);

export default router;
