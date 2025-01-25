export abstract class RoleRepository {
	abstract getPermissionsByRole(role: string): Promise<Permissions[]>;
}
