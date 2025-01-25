import { Elysia } from "elysia";
import { ApproveTicketPayment } from "src/modules/ticket-backoffice/application/ApproveTicketPayment";
import { DenyTicketPayment } from "src/modules/ticket-backoffice/application/DenyTicketPayment";
import { PostgresTypeORM } from "src/shared/database/infrastructure/postgres/PostgresTypeORM";

import { config } from "../../config";
import { PermissionsValidator } from "../../modules/auth/application/PermissionsValidator";
import { TicketBackOfficePostgresRepository } from "../../modules/ticket-backoffice/infrastructure/TicketBackOfficePostgresRepository";
import { container } from "../../shared/dependency-injection";
import { EventBus } from "../../shared/event-bus/domain/EventBus";
import { JWT } from "../../shared/JWT";
import { RoleRepository } from "../../shared/role/domain/RoleRepository";

const repository = new TicketBackOfficePostgresRepository();
const jwt = new JWT(config.jwt);
const roleRepository = container.get(RoleRepository);
const _permissionsValidator = new PermissionsValidator(roleRepository, jwt);

export const ticketBackOfficeRoutes = new Elysia({
	prefix: "/back-office/tickets",
	detail: {
		tags: ["Back Office"],
	},
})
	// .use(bearer())
	.patch("/:ticketId/approve", async ({ params }) => {
		const ticketId = params.ticketId;
		// jwt.decode(bearer as string) as { id: string };
		// await permissionsValidator.validate({
		// 	token: bearer as string,
		// 	requiredPermission: Permissions.APPROVE_TICKET_PAYMENT,
		// });

		const transaction = PostgresTypeORM.getInstance();

		try {
			await transaction.openTransaction();

			await new ApproveTicketPayment(repository, container.get(EventBus)).approve({
				ticketId,
			});
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		} finally {
			await transaction.closeTransaction();
		}
	})
	// .use(bearer())
	.patch("/:ticketId/deny", async ({ params }) => {
		// jwt.decode(bearer as string) as { id: string };
		// await permissionsValidator.validate({
		// 	token: bearer as string,
		// 	requiredPermission: Permissions.DENY_TICKET_PAYMENT,
		// });
		const ticketId = params.ticketId;
		const transaction = PostgresTypeORM.getInstance();

		try {
			await transaction.openTransaction();

			await new DenyTicketPayment(repository, container.get(EventBus)).deny({ ticketId });
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		} finally {
			await transaction.closeTransaction();
		}
	});
