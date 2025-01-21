import { DrawClosedRaffles } from "./modules/raffle/application/DrawClosedRaffles";
import { RafflePostgresRepository } from "./modules/raffle/infrastructure/RafflePostgresRepository";
import { Server } from "./server/server";
import { Cron } from "./shared/cron/domain/Cron";
import { PostgresTypeORM } from "./shared/database/infrastructure/postgres/PostgresTypeORM";
import { container } from "./shared/dependency-injection";
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
	await cron.schedule(new DrawClosedRaffles(new RafflePostgresRepository(), logger));
})();
