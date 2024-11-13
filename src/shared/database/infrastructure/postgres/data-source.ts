import { DataSource, DataSourceOptions } from "typeorm";

import { config } from "../../../../config";

const options: DataSourceOptions = {
	type: "postgres",
	host: config.postgres.host,
	port: config.postgres.port,
	username: config.postgres.username,
	password: config.postgres.password,
	database: config.postgres.database,
	synchronize: false,
	logging: true,
	entities: [],
	subscribers: [],
	migrations: [],
};
export const dataSource = new DataSource(options);
