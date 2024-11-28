import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/config/data-source';

beforeAll(async () => {
  await AppDataSource.initialize();
});

beforeEach(async () => {
  await AppDataSource.dropDatabase();
  await AppDataSource.synchronize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('Roteador de Usuários', () => {
  it('deve criar um novo usuário', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({
        nome: 'João da Silva',
        email: 'joao@example.com',
        telefone: '123456789',
        endereco: 'Rua A',
        senha: 'senha123',
        funcao: 'cliente'
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('deve listar todos os usuários', async () => {
    const response = await request(app).get('/usuarios');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('deve obter um usuário pelo ID', async () => {
    const userResponse = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Maria da Silva',
        email: 'maria@example.com',
        telefone: '987654321',
        endereco: 'Rua B',
        senha: 'senha123',
        funcao: 'cliente'
      });
    const userId = userResponse.body.id;

    const response = await request(app).get(`/usuarios/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
  });

  it('deve atualizar um usuário pelo ID', async () => {
    const userResponse = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Carlos da Silva',
        email: 'carlos@example.com',
        telefone: '123123123',
        endereco: 'Rua C',
        senha: 'senha123',
        funcao: 'cliente'
      });
    const userId = userResponse.body.id;

    const response = await request(app)
      .put(`/usuarios/${userId}`)
      .send({
        nome: 'Carlos Atualizado',
        email: 'carlos_atualizado@example.com',
        telefone: '321321321',
        endereco: 'Rua C Atualizada',
        senha: 'senha1234',
        funcao: 'admin'
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('nome', 'Carlos Atualizado');
  });

  it('deve excluir um usuário pelo ID', async () => {
    const userResponse = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Ana da Silva',
        email: 'ana@example.com',
        telefone: '456456456',
        endereco: 'Rua D',
        senha: 'senha123',
        funcao: 'cliente'
      });
    const userId = userResponse.body.id;

    const response = await request(app).delete(`/usuarios/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Usuário deletado.');
  });
});
