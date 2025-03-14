import { DrawRaffles } from "./modules/raffle/application/DrawRaffles";
import { RafflePostgresRepository } from "./modules/raffle/infrastructure/RafflePostgresRepository";
import { Server } from "./server/server";
import { Cron } from "./shared/cron/domain/Cron";
import { PostgresTypeORM } from "./shared/database/infrastructure/postgres/PostgresTypeORM";
import { container } from "./shared/dependency-injection";
import { EventBus } from "./shared/event-bus/domain/EventBus";
import { Logger } from "./shared/logger/domain/Logger";

void (async () => {
	const logger = container.get(Logger);
	PostgresTypeORM.getInstance()
		.connect()
		.then(() => logger.info("Connected to database"))
		.catch((error) => logger.error(error));
	const server = new Server(logger);
	server.start();
	const cron = container.get(Cron);
	await cron.schedule(new DrawRaffles(new RafflePostgresRepository(), logger, container.get(EventBus)));
})();
