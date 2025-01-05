import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerifiedToPayments1736107824647 implements MigrationInterface {
	name = "AddVerifiedToPayments1736107824647";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "payments" ADD "verified" boolean NOT NULL DEFAULT false`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "verified"`);
	}
}
