import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexToTicketsTable1732800253477 implements MigrationInterface {
	name = "AddIndexToTicketsTable1732800253477";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_0dd280b52af9d35cc569a67b02" ON "tickets" ("ticket_number", "raffle_id") `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "public"."IDX_0dd280b52af9d35cc569a67b02"`);
	}
}
