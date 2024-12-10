import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentIdToTicketsTable1733843761558 implements MigrationInterface {
	name = "AddPaymentIdToTicketsTable1733843761558";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "tickets" ADD "payment_id" uuid`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "payment_id"`);
	}
}
