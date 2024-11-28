import "dotenv/config";
import { AppDataSource } from "./config/data-source";
import app from "./app";

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor está rodando em: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro durante a inicialização:", err);
  });
