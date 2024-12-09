import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPaymentTable1733770607690 implements MigrationInterface {
	name = "AddedPaymentTable1733770607690";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "payments" ("id" uuid NOT NULL, "reference" character varying NOT NULL, "amount" numeric NOT NULL, "payment_method" character varying NOT NULL, "name" character varying, "dni" character varying, "phone" character varying, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "payments"`);
	}
}
