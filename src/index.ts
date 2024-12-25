import { Server } from "./server/server";
import { PostgresTypeORM } from "./shared/database/infrastructure/postgres/PostgresTypeORM";
import { Pino } from "./shared/logger/infrastructure/Pino";

void (async () => {
	const logger = new Pino();
	PostgresTypeORM.getInstance()
		.connect()
		.then(() => logger.info("Connected to database"))
		.catch((error) => logger.error(error));
	const server = new Server(logger);
	server.start();
})();
