import { DataSource, EntityTarget, ObjectLiteral, QueryRunner, Repository } from "typeorm";

import { Database } from "../../domain/Database";

import { dataSource } from "./data-source";

export class PostgresTypeORM implements Database {
	// eslint-disable-next-line no-use-before-define
	private static instance?: PostgresTypeORM;
	private queryRunner: QueryRunner | null = null;
	private connection: DataSource | null = null;
	private readonly dataSource: DataSource;

	private constructor() {
		//do nothing
	}

	static getInstance(): PostgresTypeORM {
		if (PostgresTypeORM.instance === undefined) {
			PostgresTypeORM.instance = new PostgresTypeORM();
		}

		return PostgresTypeORM.instance;
	}

	async connect(): Promise<void> {
		if (dataSource.isInitialized) {
			return;
		}

		this.connection = await dataSource.initialize();
	}

	async close(): Promise<void> {
		await this.dataSource.destroy();
	}

	async openTransaction(): Promise<void> {
		if (!this.connection) {
			return;
		}
		this.queryRunner = this.connection.createQueryRunner();
		await this.queryRunner.connect();
		await this.queryRunner.startTransaction();
	}

	async closeTransaction(): Promise<void> {
		await this.queryRunner?.release();
	}

	async commit(): Promise<void> {
		await this.queryRunner?.commitTransaction();
	}

	async rollback(): Promise<void> {
		await this.queryRunner?.rollbackTransaction();
	}

	getRepository<Entity extends ObjectLiteral>(entity: EntityTarget<Entity>): Repository<Entity> | null {
		if (!this.queryRunner?.manager) {
			return null;
		}

		return this.queryRunner.manager.getRepository(entity);
	}
}
