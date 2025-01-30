import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExchangeRatesTable1738209131065 implements MigrationInterface {
	name = "CreateExchangeRatesTable1738209131065";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "exchange_rates" ("id" uuid NOT NULL, "from" character varying NOT NULL, "to" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "price" character varying NOT NULL, CONSTRAINT "PK_33a614bad9e61956079d817ebe2" PRIMARY KEY ("id"))`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "exchange_rates"`);
	}
}
