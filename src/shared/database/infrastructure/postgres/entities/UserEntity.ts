import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({
	name: "users",
})
export class UserEntity {
	@PrimaryColumn("uuid")
	id: string;

	@Column({ type: "varchar" })
	name: string;

	@Column({ type: "varchar", name: "last_name", nullable: true })
	lastName?: string | null;

	@Column({ type: "varchar", nullable: true })
	address?: string | null;

	@Column({ unique: true, type: "varchar" })
	email: string;

	@Column({ unique: true, type: "varchar", nullable: true })
	phone?: string | null;

	@Column({ unique: true, type: "varchar", nullable: true })
	dni: string;

	@Column({ nullable: true, type: "varchar" })
	avatar: string;

	@Column({ type: "varchar" })
	password: string;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;

	@DeleteDateColumn({ name: "deleted_at", nullable: true })
	deletedAt: Date | null;
}
