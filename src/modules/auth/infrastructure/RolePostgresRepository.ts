import { dataSource } from "../../../shared/database/infrastructure/postgres/data-source";
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
}
