import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity({
	name: "permissions",
})
export class PermissionEntity {
	@PrimaryColumn("int")
	id: number;

	@Column({ unique: true, type: "varchar" })
	name: string;

	@Column({ nullable: true, type: "varchar" })
	description: string;

	@CreateDateColumn()
	createdAt: Date;
}
