import { Elysia } from "elysia";

import { TicketBackOfficeGetter } from "./../../modules/ticket-backoffice/application/TicketBackOfficeGetter";
import { TicketBackOfficePostgresRepository } from "./../../modules/ticket-backoffice/infrastructure/TicketBackOfficePostgresRepository";

const repository = new TicketBackOfficePostgresRepository();

export const userBackOfficeRoutes = new Elysia({ prefix: "/back-office/users" }).post(
	"/:userId/tickets",
	async ({ params }) => {
		const userId = params.userId;

		return new TicketBackOfficeGetter(repository).get({ userId });
	},
);
