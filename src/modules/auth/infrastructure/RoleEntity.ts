import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from "typeorm";

import { Permissions } from "../domain/Permissions";

import { PermissionEntity } from "./PermissionEntity";

@Entity({
	name: "roles",
})
export class RoleEntity {
	@PrimaryColumn("int")
	id: number;

	@Column({ unique: true, type: "varchar" })
	name: string;

	@Column({ nullable: true, type: "varchar" })
	description: string;

	@ManyToMany(() => PermissionEntity)
	@JoinTable({
		name: "role_permissions",
		joinColumn: { name: "role_id", referencedColumnName: "id" },
		inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" },
	})
	permissions: Permissions[];

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;

	@DeleteDateColumn({ name: "deleted_at", nullable: true })
	deletedAt: Date | null;
}
