import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentReferenceUnique1733842472833 implements MigrationInterface {
	name = "PaymentReferenceUnique1733842472833";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "payments" ADD CONSTRAINT "UQ_866ddee0e17d9385b4e3b86851d" UNIQUE ("reference")`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "UQ_866ddee0e17d9385b4e3b86851d"`);
	}
}
