import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { AuthenticationError, ConflictError, InvalidArgumentError, NotFoundError } from "../shared/errors";
import { UnauthorizedError } from "../shared/errors/UnauthorizedError";
import { Logger } from "../shared/logger/domain/Logger";

import { healthCheckRoutes } from "./routes/health-check-routes";
import { raffleRoutes } from "./routes/raffle-routes";
import { userBackOfficeRoutes } from "./routes/user-backoffice.routes";
import { userRoutes } from "./routes/user-routes";

export class Server {
	private readonly app: Elysia;
	private readonly logger: Logger;

	constructor(logger: Logger) {
		this.app = new Elysia()
			.use(cors())
			.use(swagger())
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
			return app.use(raffleRoutes).use(userRoutes).use(userBackOfficeRoutes);
		});
		this.logger = logger;
	}

	start(): void {
		this.app.listen(process.env.PORT ?? 3000, () =>
			this.logger.info(`Server started on port ${process.env.PORT ?? 3000}`),
		);
	}
}
