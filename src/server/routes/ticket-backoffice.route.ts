import { Elysia } from "elysia";
import { VerifyTicketPayment } from "src/modules/ticket-backoffice/application/VerifyTicketPayment";

import { TicketBackOfficePostgresRepository } from "./../../modules/ticket-backoffice/infrastructure/TicketBackOfficePostgresRepository";

const repository = new TicketBackOfficePostgresRepository();

export const ticketBackOfficeRoutes = new Elysia({
	prefix: "/back-office/tickets",
	detail: {
		tags: ["Back Office"],
	},
}).get("/tickets/:ticketId", async ({ params }) => {
	const ticketId = params.ticketId;

	return new VerifyTicketPayment(repository).verify({ ticketId });
});
