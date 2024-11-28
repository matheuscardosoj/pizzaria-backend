import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Pedido } from "./pedido.model";
import { Produto } from "./produto.model";

@Entity("pedido_produto")
export class PedidoProduto {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Pedido, pedido => pedido.produtos)
    @JoinColumn({ name: "pedido_id" })
    pedido: Pedido;

    @ManyToOne(() => Produto, produto => produto.pedidos)
    @JoinColumn({ name: "produto_id" })
    produto: Produto;

    @Column("int")
    quantidade: number;
}
