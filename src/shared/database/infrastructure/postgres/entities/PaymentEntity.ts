import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from "typeorm";

import { UserEntity } from "./UserEntity";

@Entity("payments")
export class PaymentEntity {
	@PrimaryColumn("uuid")
	id: string;

	@Column({ type: "varchar", unique: true })
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

	@Column({ type: "varchar", nullable: true })
	email?: string | null;

	@ManyToOne(() => UserEntity, (user) => user.id, { onDelete: "CASCADE" })
	@JoinColumn({ name: "user_id" })
	user: UserEntity;

	@Column({ type: "uuid", name: "user_id" })
	userId: string;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;

	@DeleteDateColumn({ name: "deleted_at", nullable: true })
	deletedAt: Date | null;
}
