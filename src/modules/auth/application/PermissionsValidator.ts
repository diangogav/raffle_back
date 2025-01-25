import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";
import { JWT } from "../../../shared/JWT";
import { RoleRepository } from "../domain/RoleRepository";

export class PermissionsValidator {
	constructor(
		private readonly roleRepository: RoleRepository,
		private readonly jwt: JWT,
	) {}

	async validate({ token, requiredPermission }: { token: string; requiredPermission: Permissions }): Promise<void> {
		const payload = this.jwt.decode(token as string) as { role: string };

		const permissions = await this.roleRepository.getPermissionsByRole(payload.role);

		const hasPermission = permissions.some((permission) => permission === requiredPermission);

		if (!hasPermission) {
			throw new UnauthorizedError(`Insufficient permits to perform this action`);
		}
	}
}
