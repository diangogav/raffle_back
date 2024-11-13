import { Elysia, t } from "elysia";

import { MostRecentRaffleGetter } from "../../modules/raffle/application/MostRecentRaffleGetter";
import { RafflePostgresRepository } from "../../modules/raffle/infrastructure/RafflePostgresRepository";

const repository = new RafflePostgresRepository();

export const raffleRoutes = new Elysia({ prefix: "/raffles" })
	.get(
		"/most-recent",
		async ({ query }) => {
			const limit = query.limit;
			const page = query.page;
			const field = "createdAt";
			const direction = "DESC";

			return new MostRecentRaffleGetter(repository).get({ limit, page, field, direction });
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

			return new MostRecentRaffleGetter(repository).get({ limit, page, field, direction });
		},
		{
			query: t.Object({
				page: t.Number({ default: 1, minimum: 1 }),
				limit: t.Number({ default: 5, maximum: 100 }),
			}),
		},
	);