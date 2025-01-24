import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import Slack from "@slack/bolt";
import { Elysia } from "elysia";
import { rateLimit } from "elysia-rate-limit";

import { SendWinnerEmailWhenRaffleIsDrawn } from "../modules/raffle/application/SendWinnerEmailWhenRaffleIsDrawn";
import { RafflePostgresRepository } from "../modules/raffle/infrastructure/RafflePostgresRepository";
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

import { config } from "./../config/index";
import { healthCheckRoutes } from "./routes/health-check-routes";
import { raffleRoutes } from "./routes/raffle-routes";
import { ticketBackOfficeRoutes } from "./routes/ticket-backoffice.route";
import { userBackOfficeRoutes } from "./routes/user-backoffice.routes";
import { userRoutes } from "./routes/user-routes";

export class Server {
	private readonly app: Elysia;
	private readonly logger: Logger;
	private readonly slack: Slack.App;

	constructor(logger: Logger) {
		this.logger = logger;
		this.slack = new Slack.App({
			signingSecret: config.slack.signingSecret,
			token: config.slack.botToken,
		});
		this.registerSubscribers();

		this.app = new Elysia()
			.use(rateLimit())
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

				if (config.env === "production" && set.status === 500) {
					const blocks = [
						{
							type: "section",
							text: {
								type: "mrkdwn",
								text: "¿Dónde **** está el backend? :fire: :fire:",
							},
						},
						{
							type: "image",
							image_url:
								"https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3Q4d2tydGNsaTFhNDBsM2tjYWtkZDk2em10Yml5c2JxcjdlemxqOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RfvBXK1m8Kcdq/giphy.gif",
							alt_text: "funny GIF",
						},
						{
							type: "section",
							text: {
								type: "mrkdwn",
								text: error.stack,
							},
						},
					];

					void this.slack.client.chat.postMessage({
						token: config.slack.botToken,
						channel: "raffle-error-notifications",
						text: "Error at Raffle API",
						blocks,
					});

					return { message: "Internal server error" };
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

		eventBus.subscribe(
			SendWinnerEmailWhenRaffleIsDrawn.ListenTo,
			new SendWinnerEmailWhenRaffleIsDrawn(
				new RafflePostgresRepository(),
				new UserPostgresRepository(),
				container.get(EmailSender),
				this.logger,
			),
		);
	}
}
