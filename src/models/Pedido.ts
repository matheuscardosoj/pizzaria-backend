import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User"; // Relacionamento com a tabela de usuários
import { Pizza } from "./Pizza"; // Relacionamento com a tabela de pizzas

@Entity("pedidos")
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Pizza)
  @JoinColumn({ name: "pizza_id" })
  pizza: Pizza;

  @Column()
  status: string; // Status do pedido (pendente, recebido, em preparação, etc.)

  @Column("decimal")
  total: number; // Valor total do pedido

  @Column()
  paymentMethod: string; // Forma de pagamento (ex: dinheiro, cartão)

  @Column({ nullable: true })
  changeAmount: number; // Para troco, caso o pagamento seja em dinheiro

  @Column()
  deliveryMethod: string; // Retirada ou entrega
}