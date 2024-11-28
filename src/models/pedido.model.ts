import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Usuario } from "./usuario.model";
import { PedidoProduto } from "./pedido_produto.model";

@Entity("pedidos")
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "usuario_id" })
  idUsuario: Usuario;

  @OneToMany(() => PedidoProduto, pedidoProduto => pedidoProduto.pedido, { cascade: true })
  produtos: PedidoProduto[];

  @Column()
  status: string;

  @Column("decimal")
  total: number;

  @Column()
  formaDePagamento: string;

  @Column()
  tipoDeEntrega: string;
}
