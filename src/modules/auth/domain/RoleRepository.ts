import { Role } from "./Role";

export abstract class RoleRepository {
	abstract getPermissionsByRole(role: string): Promise<Permissions[]>;
	abstract findRoleByName(name: string): Promise<Role | null>;
}
