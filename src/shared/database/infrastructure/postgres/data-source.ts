import { DataSource, DataSourceOptions } from "typeorm";

import { config } from "../../../../config";
import { PermissionEntity } from "../../../role/infrastructure/PermissionEntity";
import { RoleEntity } from "../../../role/infrastructure/RoleEntity";

import { PaymentEntity } from "./entities/PaymentEntity";
import { RaffleEntity } from "./entities/RaffleEntity";
import { TicketEntity } from "./entities/TicketEntity";
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
	ssl: {
		rejectUnauthorized: false,
	},
	entities: [UserEntity, RaffleEntity, TicketEntity, PaymentEntity, RoleEntity, PermissionEntity],
	subscribers: [],
	migrations: ["src/shared/database/infrastructure/postgres/migrations/*.ts"],
};
export const dataSource = new DataSource(options);
