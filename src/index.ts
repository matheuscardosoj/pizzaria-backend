import express, { Application } from "express";
import { AppDataSource } from "./data-source";
import { pizzaRoutes } from "./routes/pizza.routes";
import { userRoutes } from "./routes/user.routes";
import { pedidoRoutes } from "./routes/pedidoRoutes";
import dotenv from "dotenv";

// Carregar as variáveis de ambiente do arquivo .env
dotenv.config();
console.log("DB_HOST:", process.env.DB_HOST);

const app: Application = express();
const PORT = process.env.PORT || 3000; // Usar variável de ambiente ou valor padrão

// Middleware para processar JSON
app.use(express.json());

// Inicializar o banco de dados
AppDataSource.initialize()
  .then(() => {
    app.use("/pizzas", pizzaRoutes);
    app.use("/users", userRoutes);
    app.use("/pedidos", pedidoRoutes);

    // Iniciar o servidor
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });