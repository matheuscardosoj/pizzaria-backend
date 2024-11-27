import { Request, Response } from "express";
import { Pizza } from "../models/Pizza";
import { AppDataSource } from "../data-source";

export class PizzaController {
  private repository = AppDataSource.getRepository(Pizza);

  public list = async (request: Request, response: Response) => {
    try {
      const pizzas = await this.repository.find();
      return response.json(pizzas);
    } catch (error) {
      return response.status(500).json({ message: "Erro ao buscar pizza", error });
    }
  };

  public create = async (request: Request, response: Response) => {
    try {
      const pizza = this.repository.create(request.body);
      await this.repository.save(pizza);
      return response.status(201).json(pizza);
    } catch (error) {
      return response.status(500).json({ message: "Erro ao criar pizza", error });
    }
  };

  public show = async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const pizza = await this.repository.findOne({ where: { id: Number(id) } });

      if (!pizza) {
        return response.status(404).json({ message: "Pizza nao encontrada" });
      }

      return response.json(pizza);
    } catch (error) {
      return response.status(500).json({ message: "Erro ao encontrar pizza", error });
    }
  };

  public delete = async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const pizza = await this.repository.findOne({ where: { id: Number(id) } });

      if (!pizza) {
        return response.status(404).json({ message: "Pizza nao encontrada" });
      }

      await this.repository.remove(pizza);

      return response.json({ message: "Pizza deleteda" });
    } catch (error) {
      return response.status(500).json({ message: "Erro ao deletar pizza", error });
    }
  };
}
