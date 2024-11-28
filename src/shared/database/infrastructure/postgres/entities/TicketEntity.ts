import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity, Index,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn
} from "typeorm";

import { RaffleEntity } from "./RaffleEntity";
import { UserEntity } from "./UserEntity";

@Entity({ name: "tickets" })
@Index(["ticketNumber", "raffleId"], { unique: true })
export class TicketEntity {
	@PrimaryColumn("uuid")
	id: string;

	@Column({ name: "ticket_number", type: "varchar" })
	ticketNumber: string;

	@ManyToOne(() => UserEntity, (user) => user.id, { onDelete: "CASCADE" })
	@JoinColumn({ name: "user_id" })
	user: UserEntity;

	@ManyToOne(() => RaffleEntity, (raffle) => raffle.id, { onDelete: "CASCADE" })
	@JoinColumn({ name: "raffle_id" })
	raffle: RaffleEntity;

	@Column({ type: "uuid", name: "user_id" })
	userId: string;

	@Column({ type: "uuid", name: "raffle_id" })
	raffleId: string;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;

	@DeleteDateColumn({ name: "deleted_at", nullable: true })
	deletedAt: Date | null;
}
