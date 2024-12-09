import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("payments")
export class PaymentEntity {
	@PrimaryColumn("uuid")
	id: string;

	@Column({ type: "varchar" })
	reference: string;

	@Column({ type: "numeric" })
	amount: number;

	@Column({ type: "varchar", name: "payment_method" })
	paymentMethod: string;

	@Column({ type: "varchar", nullable: true })
	name?: string | null;

	@Column({ type: "varchar", nullable: true })
	dni?: string | null;

	@Column({ type: "varchar", nullable: true })
	phone?: string | null;
}
