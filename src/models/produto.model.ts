import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Categoria } from "./categoria.model";
import { PedidoProduto } from "./pedido_produto.model";

@Entity("produtos")
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @OneToMany(() => PedidoProduto, pedidoProduto => pedidoProduto.produto)
  pedidos: PedidoProduto[];

  @Column("decimal")
  preco: number;

  @ManyToOne(() => Categoria)
  @JoinColumn({ name: "categoria_id" })
  categoria: Categoria;
}
