import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";
import { JWT } from "../../../shared/JWT";
import { Permissions } from "../../../shared/role/domain/Permissions";
import { RoleRepository } from "../../../shared/role/domain/RoleRepository";

export class PermissionsValidator {
	constructor(
		private readonly roleRepository: RoleRepository,
		private readonly jwt: JWT,
	) {}

	async validate({ token, requiredPermission }: { token: string; requiredPermission: Permissions }): Promise<void> {
		const payload = this.jwt.decode(token as string) as { roles: string[] };

		const permissions = await this.roleRepository.getPermissionsByRoles(payload.roles);

		const hasPermission = permissions.some((permission) => permission === requiredPermission);

		if (!hasPermission) {
			throw new UnauthorizedError(`Insufficient permits to perform this action`);
		}
	}
}
