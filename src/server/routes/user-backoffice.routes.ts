import bearer from "@elysiajs/bearer";
import { Elysia } from "elysia";
import { PermissionsValidator } from "src/modules/auth/application/PermissionsValidator";
import { Permissions } from "src/shared/role/domain/Permissions";

import { config } from "../../config";
import { TicketBackOfficeGetter } from "../../modules/ticket-backoffice/application/TicketBackOfficeGetter";
import { TicketBackOfficePostgresRepository } from "../../modules/ticket-backoffice/infrastructure/TicketBackOfficePostgresRepository";
import { container } from "../../shared/dependency-injection";
import { JWT } from "../../shared/JWT";
import { RoleRepository } from "../../shared/role/domain/RoleRepository";

const repository = new TicketBackOfficePostgresRepository();
const jwt = new JWT(config.jwt);
const roleRepository = container.get(RoleRepository);
const permissionsValidator = new PermissionsValidator(roleRepository, jwt);

export const userBackOfficeRoutes = new Elysia({
	prefix: "/back-office/users",
	detail: {
		tags: ["Back Office"],
	},
})
	.use(bearer())
	.get("/:userId/tickets", async ({ params }) => {
		const userId = params.userId;

		jwt.decode(bearer as unknown as string) as { id: string };
		await permissionsValidator.validate({
			token: bearer as unknown as string,
			requiredPermission: Permissions.BACKOFFICE_READ_USER_TICKET,
		});

		return new TicketBackOfficeGetter(repository).get({ userId });
	});
