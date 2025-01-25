import { dataSource } from "../../database/infrastructure/postgres/data-source";
import { Role } from "../domain/Role";
import { RoleRepository } from "../domain/RoleRepository";

import { RoleEntity } from "./RoleEntity";

export class RolePostgresRepository extends RoleRepository {
	async getPermissionsByRole(roleName: string): Promise<Permissions[]> {
		const repository = dataSource.getRepository(RoleEntity);

		const role = await repository
			.createQueryBuilder("role")
			.leftJoinAndSelect("role.permissions", "permission")
			.where("role.name = :roleName", { roleName })
			.getOne();

		return role?.permissions.map((permission) => permission.name as unknown as Permissions) ?? [];
	}

	async findRoleByName(name: string): Promise<Role | null> {
		const repository = dataSource.getRepository(RoleEntity);

		const role = await repository.findOne({
			where: { name },
		});

		if (!role) {
			return null;
		}

		return Role.from(role);
	}

	async getPermissionsByRoles(roleNames: string[]): Promise<Permissions[]> {
		const repository = dataSource.getRepository(RoleEntity);

		const roles = await repository
			.createQueryBuilder("role")
			.leftJoinAndSelect("role.permissions", "permission")
			.where("role.name IN (:...roleNames)", { roleNames })
			.getMany();

		const permissions: Permissions[] = [];

		roles.forEach((role) => {
			role.permissions.forEach((permission) => {
				permissions.push(permission.name as unknown as Permissions);
			});
		});

		return permissions;
	}
}
