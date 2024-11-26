import { Elysia, t } from "elysia";

import { OngoingRafflesGetter } from "../../modules/raffle/application/OngoingRafflesGetter";
import { RafflePostgresRepository } from "../../modules/raffle/infrastructure/RafflePostgresRepository";
import { RaffleTicketsGetter } from "../../modules/raffle/tickets/application/RaffleTicketsGetter";
import { TicketPostgresRepository } from "../../modules/raffle/tickets/infrastructure/TicketPostgresRepository";

const repository = new RafflePostgresRepository();
const ticketRepository = new TicketPostgresRepository();

export const raffleRoutes = new Elysia({ prefix: "/raffles" })
	.get(
		"/most-recent",
		async ({ query }) => {
			const limit = query.limit;
			const page = query.page;
			const field = "createdAt";
			const direction = "DESC";

			return new OngoingRafflesGetter(repository).get({ limit, page, field, direction });
		},
		{
			query: t.Object({
				page: t.Number({ default: 1, minimum: 1 }),
				limit: t.Number({ default: 5, maximum: 100 }),
			}),
		},
	)
	.get(
		"/lowest-prices",
		async ({ query }) => {
			const limit = query.limit;
			const page = query.page;
			const field = "ticketPrice";
			const direction = "ASC";

			return new OngoingRafflesGetter(repository).get({ limit, page, field, direction });
		},
		{
			query: t.Object({
				page: t.Number({ default: 1, minimum: 1 }),
				limit: t.Number({ default: 5, maximum: 100 }),
			}),
		},
	)
	.get(
		":raffleId/tickets",
		async ({ params }) => {
			const raffleId = params.raffleId;

			return new RaffleTicketsGetter(ticketRepository).get({ raffleId });
		},
		{
			params: t.Object({
				raffleId: t.String(),
			}),
		},
	);
