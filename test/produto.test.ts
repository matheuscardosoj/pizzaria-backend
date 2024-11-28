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

describe('Roteador de Produtos', () => {
    it('deve criar um novo produto', async () => {
        const categoriaResponse = await request(app)
            .post('/categorias')
            .send({ nome: 'Pizza' });
        const categoriaId = categoriaResponse.body.id;

        const response = await request(app)
            .post('/produtos')
            .send({
                nome: 'Pizza Margherita',
                preco: 25.50,
                categoriaId: categoriaId
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    it('deve listar todos os produtos', async () => {
        const response = await request(app).get('/produtos');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('deve obter um produto pelo ID', async () => {
        const categoriaResponse = await request(app)
            .post('/categorias')
            .send({ nome: 'Bebida' });
        const categoriaId = categoriaResponse.body.id;

        const produtoResponse = await request(app)
            .post('/produtos')
            .send({
                nome: 'Coca-Cola',
                preco: 5.00,
                categoriaId: categoriaId
            });
        const produtoId = produtoResponse.body.id;

        const response = await request(app).get(`/produtos/${produtoId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', produtoId);
    });

    it('deve atualizar um produto pelo ID', async () => {
        const categoriaResponse = await request(app)
            .post('/categorias')
            .send({ nome: 'Sobremesa' });
        const categoriaId = categoriaResponse.body.id;

        const produtoResponse = await request(app)
            .post('/produtos')
            .send({
                nome: 'Sorvete',
                preco: 10.00,
                categoriaId: categoriaId
            });
        const produtoId = produtoResponse.body.id;

        const response = await request(app)
            .put(`/produtos/${produtoId}`)
            .send({
                nome: 'Sorvete de Chocolate',
                preco: 12.00,
                categoriaId: categoriaId
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('nome', 'Sorvete de Chocolate');
    });

    it('deve excluir um produto pelo ID', async () => {
        const categoriaResponse = await request(app)
            .post('/categorias')
            .send({ nome: 'Entrada' });
        const categoriaId = categoriaResponse.body.id;

        const produtoResponse = await request(app)
            .post('/produtos')
            .send({
                nome: 'Bruschetta',
                preco: 15.00,
                categoriaId: categoriaId
            });
        const produtoId = produtoResponse.body.id;

        const response = await request(app).delete(`/produtos/${produtoId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Produto deletado.');
    });
});
