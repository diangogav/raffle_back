import { Elysia } from "elysia";
import { PaymentStatus } from "src/modules/payment/domain/PaymentStatus";
import { UpdateTicketPaymentStatus } from "src/modules/ticket-backoffice/application/UpdateTicketPaymentStatus";

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

		return new UpdateTicketPaymentStatus(repository).changeStatus({ ticketId, status: PaymentStatus.APPROVED });
	})
	.patch("/:ticketId/deny", async ({ params }) => {
		const ticketId = params.ticketId;

		return new UpdateTicketPaymentStatus(repository).changeStatus({ ticketId, status: PaymentStatus.DENIED });
	});
