import { Elysia } from "elysia";
import { ApproveTicketPaymentStatus } from "src/modules/ticket-backoffice/application/ApproveTicketPaymentStatus";
import { DenyTicketPaymentStatus } from "src/modules/ticket-backoffice/application/DenyTicketPaymentStatus";
import { PostgresTypeORM } from "src/shared/database/infrastructure/postgres/PostgresTypeORM";

import { TicketBackOfficePostgresRepository } from "./../../modules/ticket-backoffice/infrastructure/TicketBackOfficePostgresRepository";

const repository = new TicketBackOfficePostgresRepository();

export const ticketBackOfficeRoutes = new Elysia({
	prefix: "/back-office/tickets",
	detail: {
		tags: ["Back Office"],
	},
})
	.patch("/:ticketId/approve", async ({ params }) => {
		const ticketId = params.ticketId;

		return new ApproveTicketPaymentStatus(repository).approve({ ticketId });
	})
	.patch("/:ticketId/deny", async ({ params }) => {
		const ticketId = params.ticketId;
		const transaction = PostgresTypeORM.getInstance();

		try {
			await transaction.openTransaction();

			await new DenyTicketPaymentStatus(repository).deny({ ticketId });
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		} finally {
			await transaction.closeTransaction();
		}
	});
