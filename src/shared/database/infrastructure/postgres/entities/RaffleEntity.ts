import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { RaffleStatus } from "../../../../../modules/raffle/domain/RaffleStatus.enum";

@Entity({
	name: "raffles",
})
export class RaffleEntity {
	@PrimaryColumn("uuid")
	id: string;

	@Column({ type: "varchar" })
	title: string;

	@Column({ type: "varchar", nullable: true })
	description: string;

	@Column({ type: "numeric", name: "ticket_price" })
	ticketPrice: number;

	@Column({ type: "timestamp", name: "end_date" })
	endDate: Date;

	@Column({ type: "numeric", name: "total_tickets" })
	totalTickets: number;

	@Column({ type: "uuid", name: "user_id" })
	userId: string;

	@Column({ type: "varchar", nullable: true })
	cover: string;

	@Column({
		type: "enum",
		enum: RaffleStatus,
		default: RaffleStatus.PENDING,
	})
	status: RaffleStatus;

	@Column({
		type: "uuid",
		array: true,
		name: "winning_tickets",
		nullable: true,
	})
	winningTickets?: string[] | null;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;

	@DeleteDateColumn({ name: "deleted_at", nullable: true })
	deletedAt: Date | null;
}
