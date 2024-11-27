import request from "supertest";
import { AppDataSource } from "../src/data-source";
import app from "../src/index";

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe("UserController", () => {
  it("deve criar um novo usuário com sucesso", async () => {
    const response = await request(app).post("/users").send({
      name: "João da Silva",
      email: "joao@example.com",
      phone: "123456789",
      address: "Rua A",
      city: "Cidade B",
      state: "Estado C",
      postalCode: "12345-678",
      password: "senha123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe("joao@example.com");
  });

  it("não deve permitir criar usuário com e-mail já cadastrado", async () => {
    // Tentando criar um segundo usuário com o mesmo email
    const response = await request(app).post("/users").send({
      name: "Maria da Silva",
      email: "joao@example.com", // Mesmo email do teste anterior
      phone: "987654321",
      address: "Rua B",
      city: "Cidade D",
      state: "Estado E",
      postalCode: "98765-432",
      password: "senha456",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Email já cadastrado.");
  });

  it("deve listar todos os usuários", async () => {
    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("email");
  });
});