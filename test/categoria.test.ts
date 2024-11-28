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

describe('Roteador de Categorias', () => {
    it('deve criar uma nova categoria', async () => {
        const response = await request(app)
            .post('/categorias')
            .send({
                nome: 'Pizza'
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    it('deve listar todas as categorias', async () => {
        const response = await request(app).get('/categorias');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('deve obter uma categoria pelo ID', async () => {
        const categoriaResponse = await request(app)
            .post('/categorias')
            .send({
                nome: 'Bebida'
            });
        const categoriaId = categoriaResponse.body.id;

        const response = await request(app).get(`/categorias/${categoriaId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', categoriaId);
    });

    it('deve atualizar uma categoria pelo ID', async () => {
        const categoriaResponse = await request(app)
            .post('/categorias')
            .send({
                nome: 'Sobremesa'
            });
        const categoriaId = categoriaResponse.body.id;

        const response = await request(app)
            .put(`/categorias/${categoriaId}`)
            .send({
                nome: 'Sobremesa Atualizada'
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('nome', 'Sobremesa Atualizada');
    });

    it('deve excluir uma categoria pelo ID', async () => {
        const categoriaResponse = await request(app)
            .post('/categorias')
            .send({
                nome: 'Entrada'
            });
        const categoriaId = categoriaResponse.body.id;

        const response = await request(app).delete(`/categorias/${categoriaId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Categoria deletada.');
    });
});
