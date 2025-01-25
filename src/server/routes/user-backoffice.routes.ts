import bearer from "@elysiajs/bearer";
import { Elysia } from "elysia";

import { config } from "../../config";
import { PermissionsValidator } from "../../modules/auth/application/PermissionsValidator";
import { Permissions } from "../../modules/auth/domain/Permissions";
import { RoleRepository } from "../../modules/auth/domain/RoleRepository";
import { TicketBackOfficeGetter } from "../../modules/ticket-backoffice/application/TicketBackOfficeGetter";
import { TicketBackOfficePostgresRepository } from "../../modules/ticket-backoffice/infrastructure/TicketBackOfficePostgresRepository";
import { container } from "../../shared/dependency-injection";
import { JWT } from "../../shared/JWT";

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
	.get("/:userId/tickets", async ({ params, bearer }) => {
		const userId = params.userId;

		jwt.decode(bearer as string) as { id: string };
		await permissionsValidator.validate({
			token: bearer as string,
			requiredPermission: Permissions.BACKOFFICE_READ_USER_TICKET,
		});

		return new TicketBackOfficeGetter(repository).get({ userId });
	});
