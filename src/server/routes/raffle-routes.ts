import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";

import { config } from "../../config";
import { BuyTicket } from "../../modules/raffle/application/BuyTicket";
import { OngoingRafflesGetter } from "../../modules/raffle/application/OngoingRafflesGetter";
import { RaffleDetailFinder } from "../../modules/raffle/application/RaffleDetailFinder";
import { RafflePostgresRepository } from "../../modules/raffle/infrastructure/RafflePostgresRepository";
import { JWT } from "../../shared/JWT";

const repository = new RafflePostgresRepository();
const jwt = new JWT(config.jwt);

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
		":raffleId",
		async ({ params }) => {
			const raffleId = params.raffleId;

			return new RaffleDetailFinder(repository).get({ raffleId });
		},
		{
			params: t.Object({
				raffleId: t.String(),
			}),
		},
	)
	.use(bearer())
	.post(
		":raffleId/buy-ticket",
		async ({ body, bearer, params }) => {
			const token = jwt.decode(bearer as string) as { id: string };
			const raffleId = params.raffleId;

			return new BuyTicket(repository).buy({ ...body, userId: token.id, raffleId });
		},
		{
			body: t.Object({
				ticketNumbers: t.Array(t.Number(), { minItems: 1, maxItems: 10 }),
			}),
			params: t.Object({
				raffleId: t.String(),
			}),
		},
	);
