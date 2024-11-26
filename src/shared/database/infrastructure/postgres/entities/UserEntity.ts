import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({
	name: "users",
})
export class UserEntity {
	@PrimaryColumn("uuid")
	id: string;

	@Column({ type: "varchar" })
	name: string;

	@Column({ type: "varchar", name: "last_name" })
	lastName: string;

	@Column({ type: "varchar" })
	address: string;

	@Column({ unique: true, type: "varchar" })
	email: string;

	@Column({ unique: true, type: "varchar" })
	phone: string;

	@Column({ unique: true, type: "varchar" })
	dni: string;

	@Column({ nullable: true, type: "varchar" })
	avatar: string | null;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;

	@DeleteDateColumn({ name: "deleted_at", nullable: true })
	deletedAt: Date | null;
}
