import { DataSource, DataSourceOptions } from "typeorm";

import { config } from "../../../../config";

import { UserEntity } from "./entities/UserEntity";

const options: DataSourceOptions = {
	type: "postgres",
	host: config.postgres.host,
	port: config.postgres.port,
	username: config.postgres.username,
	password: config.postgres.password,
	database: config.postgres.database,
	synchronize: false,
	logging: true,
	entities: [UserEntity],
	subscribers: [],
	migrations: ["src/shared/database/infrastructure/postgres/migrations/*.ts"],
};
export const dataSource = new DataSource(options);
