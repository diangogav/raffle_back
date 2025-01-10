import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { SendEmailWhenTicketPaymentApproved } from "../modules/ticket-backoffice/application/SendEmailWhenTicketPaymentApproved";
import { SendEmailWhenTicketPaymentDenied } from "../modules/ticket-backoffice/application/SendEmailWhenTicketPaymentDenied";
import { SendEmailWhenTicketsPurchased } from "../modules/ticket-backoffice/application/SendEmailWhenTicketsPurchased";
import { UserPostgresRepository } from "../modules/user/infrastructure/UserPostgresRepository";
import { container } from "../shared/dependency-injection";
import { EmailSender } from "../shared/email/domain/EmailSender";
import { AuthenticationError, ConflictError, InvalidArgumentError, NotFoundError } from "../shared/errors";
import { UnauthorizedError } from "../shared/errors/UnauthorizedError";
import { EventBus } from "../shared/event-bus/domain/EventBus";
import { Logger } from "../shared/logger/domain/Logger";
import { UserFinderDomainService } from "../shared/user/domain/UserFinderDomainService";

import { RafflePostgresRepository } from "./../modules/raffle/infrastructure/RafflePostgresRepository";
import { healthCheckRoutes } from "./routes/health-check-routes";
import { raffleRoutes } from "./routes/raffle-routes";
import { ticketBackOfficeRoutes } from "./routes/ticket-backoffice.route";
import { userBackOfficeRoutes } from "./routes/user-backoffice.routes";
import { userRoutes } from "./routes/user-routes";

export class Server {
	private readonly app: Elysia;
	private readonly logger: Logger;

	constructor(logger: Logger) {
		this.logger = logger;
		this.registerSubscribers();

		this.app = new Elysia()
			.use(cors())
			.use(
				swagger({
					documentation: {
						tags: [
							{ name: "Users", description: "User endpoints" },
							{ name: "Auth", description: "Authentication endpoints" },
							{ name: "Raffles", description: "Raffles endpoints" },
							{ name: "Back Office", description: "Back Office endpoints" },
						],
					},
				}),
			)
			.onError(({ error, set }) => {
				this.logger.error(error);

				if (error instanceof ConflictError) {
					set.status = 409;
				}

				if (error instanceof AuthenticationError) {
					set.status = 401;
				}

				if (error instanceof NotFoundError) {
					set.status = 404;
				}

				if (error instanceof InvalidArgumentError) {
					set.status = 400;
				}

				if (error instanceof UnauthorizedError) {
					set.status = 401;
				}

				return error;
			})
			.use(healthCheckRoutes);
		// @ts-expect-error linter not config correctly
		this.app.group("/api/v1", (app: Elysia) => {
			return app.use(raffleRoutes).use(userRoutes).use(userBackOfficeRoutes).use(ticketBackOfficeRoutes);
		});
	}

	start(): void {
		this.app.listen(process.env.PORT ?? 3000, () =>
			this.logger.info(`Server started on port ${process.env.PORT ?? 3000}`),
		);
	}

	private registerSubscribers(): void {
		const eventBus = container.get(EventBus);

		eventBus.subscribe(
			SendEmailWhenTicketPaymentApproved.ListenTo,
			new SendEmailWhenTicketPaymentApproved(
				this.logger,
				new UserFinderDomainService(new UserPostgresRepository()),
				new RafflePostgresRepository(),
				container.get(EmailSender),
			),
		);
		eventBus.subscribe(
			SendEmailWhenTicketPaymentDenied.ListenTo,
			new SendEmailWhenTicketPaymentDenied(
				this.logger,
				new UserFinderDomainService(new UserPostgresRepository()),
				container.get(EmailSender),
			),
		);
		eventBus.subscribe(
			SendEmailWhenTicketsPurchased.ListenTo,
			new SendEmailWhenTicketsPurchased(
				this.logger,
				new UserFinderDomainService(new UserPostgresRepository()),
				container.get(EmailSender),
			),
		);
	}
}
