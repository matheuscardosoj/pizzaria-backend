import { Router } from "express";
import { PizzaController } from "../controllers/PizzaController";

const pizzaRoutes:Router = Router();
const pizzaController = new PizzaController();

pizzaRoutes.post("/", pizzaController.create);
pizzaRoutes.get("/", pizzaController.list);
pizzaRoutes.get("/:id", pizzaController.show);
pizzaRoutes.delete("/:id", pizzaController.delete);

export { pizzaRoutes };