import { DataSource } from "typeorm";

import { Logger } from "../../../logger/domain/Logger";
import { Database } from "../../domain/Database";

import { dataSource } from "./data-source";

export class PostgresTypeORM implements Database {
	private readonly dataSource: DataSource;

	constructor(private readonly logger: Logger) {
		this.dataSource = dataSource;
	}

	async connect(): Promise<void> {
		await this.dataSource.initialize();
		this.logger.info("Connected to Database");
	}

	async close(): Promise<void> {
		await this.dataSource.destroy();
	}
}
