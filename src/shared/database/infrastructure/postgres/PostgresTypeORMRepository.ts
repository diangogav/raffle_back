import { EntityTarget, ObjectLiteral, Repository } from "typeorm";

import { PostgresTypeORM } from "./PostgresTypeORM";

export class PostgresTypeORMRepository {
	constructor(private readonly connection: PostgresTypeORM = PostgresTypeORM.getInstance()) {}

	getRepository<Entity extends ObjectLiteral>(entity: EntityTarget<Entity>): Repository<Entity> {
		const repository = this.connection.getRepository(entity);

		if (!repository) {
			throw new Error("Repository not found.");
		}

		return repository;
	}
}
