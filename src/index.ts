import { Server } from "./server/server";
import { PostgresTypeORM } from "./shared/database/infrastructure/postgres/PostgresTypeORM";
import { Pino } from "./shared/logger/infrastructure/Pino";

void (async () => {
	const logger = new Pino();
	const database = new PostgresTypeORM();
	await database.connect().catch((error) => logger.error(error));
	const server = new Server(logger);
	server.start();
})();
