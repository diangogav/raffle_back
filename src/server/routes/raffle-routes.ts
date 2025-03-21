import bearer from "@elysiajs/bearer";
import { randomUUID } from "crypto";
import { Elysia, t } from "elysia";
import { ExchangeRateRepository } from "src/shared/exchange-rate/domain/ExchangeRateRepository";

import { config } from "../../config";
import { PermissionsValidator } from "../../modules/auth/application/PermissionsValidator";
import { PaymentMethod } from "../../modules/payment/domain/PaymentMethod.enum";
import { PaymentPostgresRepository } from "../../modules/payment/infrastructure/PaymentPostgresRepository";
import { BuyTicket } from "../../modules/raffle/application/BuyTicket";
import { RaffleDetailFinder } from "../../modules/raffle/application/RaffleDetailFinder";
import { RaffleGetter } from "../../modules/raffle/application/RaffleGetter";
import { RafflesResumeGetter } from "../../modules/raffle/application/RafflesResumeGetter";
import { RaffleWinnersGetter } from "../../modules/raffle/application/RaffleWinnersGetter";
import { RaffleStatus } from "../../modules/raffle/domain/RaffleStatus.enum";
import { RafflePostgresRepository } from "../../modules/raffle/infrastructure/RafflePostgresRepository";
import { PostgresTypeORM } from "../../shared/database/infrastructure/postgres/PostgresTypeORM";
import { container } from "../../shared/dependency-injection";
import { EventBus } from "../../shared/event-bus/domain/EventBus";
import { JWT } from "../../shared/JWT";
import { Permissions } from "../../shared/role/domain/Permissions";
import { RoleRepository } from "../../shared/role/domain/RoleRepository";

const repository = new RafflePostgresRepository();
const paymentRepository = new PaymentPostgresRepository();
const exchangeRateRepository = container.get(ExchangeRateRepository);
const jwt = new JWT(config.jwt);
const roleRepository = container.get(RoleRepository);
const permissionsValidator = new PermissionsValidator(roleRepository, jwt);

export const raffleRoutes = new Elysia({
	prefix: "/raffles",
	detail: {
		tags: ["Raffles"],
	},
})
	.get(
		"/most-recent",
		async ({ query }) => {
			const limit = query.limit;
			const page = query.page;
			const field = "createdAt";
			const direction = "DESC";

			return new RaffleGetter(repository, exchangeRateRepository).get({
				limit,
				page,
				field,
				direction,
				statuses: [RaffleStatus.ONGOING, RaffleStatus.SORTABLE],
			});
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

			return new RaffleGetter(repository, exchangeRateRepository).get({
				limit,
				page,
				field,
				direction,
				statuses: [RaffleStatus.ONGOING, RaffleStatus.SORTABLE],
			});
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

			return new RaffleDetailFinder(repository, exchangeRateRepository).get({ raffleId });
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
			await permissionsValidator.validate({
				token: bearer as string,
				requiredPermission: Permissions.CREATE_TICKET,
			});
			const raffleId = params.raffleId;
			const paymentId = randomUUID();
			const transaction = PostgresTypeORM.getInstance();

			try {
				await transaction.openTransaction();
				const buyTicket = new BuyTicket(
					repository,
					paymentRepository,
					exchangeRateRepository,
					container.get(EventBus),
				);
				await buyTicket.buy({
					...body,
					userId: token.id,
					raffleId,
					paymentId,
				});
				await transaction.commit();
			} catch (error) {
				await transaction.rollback();
				throw error;
			} finally {
				await transaction.closeTransaction();
			}
		},
		{
			body: t.Object({
				ticketNumbers: t.Array(t.Number(), { minItems: 1, maxItems: 10 }),
				reference: t.String(),
				name: t.Optional(t.String()),
				dni: t.Optional(t.String()),
				phone: t.Optional(t.String()),
				paymentAmount: t.Number({ minimum: 0 }),
				email: t.Optional(t.String({ format: "email" })),
				paymentMethod: t.Enum(PaymentMethod),
			}),
			params: t.Object({
				raffleId: t.String(),
			}),
		},
	)
	.use(bearer())
	.get("/not-drawn", async ({ bearer }) => {
		const token = jwt.decode(bearer as string) as { id: string };

		await permissionsValidator.validate({
			token: bearer as string,
			requiredPermission: Permissions.READ_RAFFLE,
		});

		return new RafflesResumeGetter(repository, exchangeRateRepository).get({
			userId: token.id,
			statuses: [RaffleStatus.ONGOING, RaffleStatus.CLOSED, RaffleStatus.SORTABLE],
		});
	})
	.get("/drawn", async ({ bearer }) => {
		const token = jwt.decode(bearer as string) as { id: string };

		await permissionsValidator.validate({
			token: bearer as string,
			requiredPermission: Permissions.READ_RAFFLE,
		});

		return new RafflesResumeGetter(repository, exchangeRateRepository).get({
			userId: token.id,
			statuses: [RaffleStatus.DRAWN, RaffleStatus.WINNER_CONFIRMED, RaffleStatus.FINISHED],
		});
	})
	.get("/", async ({ bearer }) => {
		const token = jwt.decode(bearer as string) as { id: string };

		await permissionsValidator.validate({
			token: bearer as string,
			requiredPermission: Permissions.READ_RAFFLE,
		});

		return new RafflesResumeGetter(repository, exchangeRateRepository).get({
			userId: token.id,
			statuses: [
				RaffleStatus.ONGOING,
				RaffleStatus.CLOSED,
				RaffleStatus.DRAWN,
				RaffleStatus.WINNER_CONFIRMED,
				RaffleStatus.FINISHED,
				RaffleStatus.SORTABLE,
			],
		});
	})
	.use(bearer())
	.get(
		":raffleId/winners",
		async ({ params, bearer }) => {
			jwt.decode(bearer as string) as { id: string };

			await permissionsValidator.validate({
				token: bearer as string,
				requiredPermission: Permissions.READ_RAFFLE,
			});

			const raffleId = params.raffleId;

			return new RaffleWinnersGetter(repository).get({ raffleId });
		},
		{
			params: t.Object({
				raffleId: t.String(),
			}),
		},
	);
