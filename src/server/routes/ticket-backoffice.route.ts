import { Elysia } from "elysia";
import { ApproveTicketPayment } from "src/modules/ticket-backoffice/application/ApproveTicketPayment";
import { DenyTicketPayment } from "src/modules/ticket-backoffice/application/DenyTicketPayment";
import { PostgresTypeORM } from "src/shared/database/infrastructure/postgres/PostgresTypeORM";

import { TicketBackOfficePostgresRepository } from "../../modules/ticket-backoffice/infrastructure/TicketBackOfficePostgresRepository";

const repository = new TicketBackOfficePostgresRepository();

export const ticketBackOfficeRoutes = new Elysia({
	prefix: "/back-office/tickets",
	detail: {
		tags: ["Back Office"],
	},
})
	.patch("/:ticketId/approve", async ({ params }) => {
		const ticketId = params.ticketId;

		return new ApproveTicketPayment(repository).approve({ ticketId });
	})
	.patch("/:ticketId/deny", async ({ params }) => {
		const ticketId = params.ticketId;
		const transaction = PostgresTypeORM.getInstance();

		try {
			await transaction.openTransaction();

			await new DenyTicketPayment(repository).deny({ ticketId });
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		} finally {
			await transaction.closeTransaction();
		}
	});
