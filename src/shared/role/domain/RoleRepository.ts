import { Permissions } from "./Permissions";
import { Role } from "./Role";

export abstract class RoleRepository {
	abstract getPermissionsByRole(roleName: string): Promise<Permissions[]>;
	abstract getPermissionsByRoles(roles: string[]): Promise<Permissions[]>;
	abstract findRoleByName(name: string): Promise<Role | null>;
}
