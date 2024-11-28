import express, { Application } from "express";
import categoriaRoutes from "./routes/categoria.routes";
import pedidoRoutes from "./routes/pedido.routes";
import produtoRoutes from "./routes/produto.routes";
import userRoutes from "./routes/usuario.routes";

const app: Application = express();

app.use(express.json());

app.use("/categorias", categoriaRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/produtos", produtoRoutes);
app.use("/usuarios", userRoutes);

export default app;
