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

describe('Roteador de Pedidos', () => {
    it('deve criar um novo pedido', async () => {
        const userResponse = await request(app)
            .post('/usuarios')
            .send({
                nome: 'João da Silva',
                email: 'joao@example.com',
                telefone: '123456789',
                endereco: 'Rua A',
                senha: 'senha123',
                funcao: 'cliente'
            });
        const userId = userResponse.body.id;

        const categoriaResponse = await request(app)
            .post('/categorias')
            .send({ nome: 'Pizza' });
        const categoriaId = categoriaResponse.body.id;

        const produtoResponse = await request(app)
            .post('/produtos')
            .send({
                nome: 'Pizza Margherita',
                preco: 25.50,
                categoriaId: categoriaId
            });
        const produtoId = produtoResponse.body.id;

        const response = await request(app)
            .post('/pedidos')
            .send({
                idUsuario: userId,
                produtos: [{ id: produtoId, quantidade: 2 }],
                status: 'pendente',
                formaDePagamento: 'cartão',
                tipoDeEntrega: 'entrega'
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    it('deve listar todos os pedidos', async () => {
        const response = await request(app).get('/pedidos');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('deve obter um pedido pelo ID', async () => {
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

        const pedidoResponse = await request(app)
            .post('/pedidos')
            .send({
                idUsuario: userId,
                produtos: [{ id: produtoId, quantidade: 3 }],
                status: 'pendente',
                formaDePagamento: 'dinheiro',
                tipoDeEntrega: 'retirada'
            });
        const pedidoId = pedidoResponse.body.id;

        const response = await request(app).get(`/pedidos/${pedidoId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', pedidoId);
    });

    it('deve atualizar o status de um pedido pelo ID', async () => {
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

        const pedidoResponse = await request(app)
            .post('/pedidos')
            .send({
                idUsuario: userId,
                produtos: [{ id: produtoId, quantidade: 1 }],
                status: 'pendente',
                formaDePagamento: 'cartão',
                tipoDeEntrega: 'entrega'
            });
        const pedidoId = pedidoResponse.body.id;

        const response = await request(app)
            .put(`/pedidos/status/${pedidoId}`)
            .send({ status: 'entregue' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'entregue');
    });

    it('deve excluir um pedido pelo ID', async () => {
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

        const pedidoResponse = await request(app)
            .post('/pedidos')
            .send({
                idUsuario: userId,
                produtos: [{ id: produtoId, quantidade: 2 }],
                status: 'pendente',
                formaDePagamento: 'dinheiro',
                tipoDeEntrega: 'retirada'
            });
        const pedidoId = pedidoResponse.body.id;

        const response = await request(app).delete(`/pedidos/${pedidoId}`);
        expect(response.status).toBe(204);
    });
});