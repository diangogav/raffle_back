import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedWinnerTicketsToRaffle1737473630226 implements MigrationInterface {
	name = "AddedWinnerTicketsToRaffle1737473630226";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "raffles" ADD "winning_tickets" uuid array`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "raffles" DROP COLUMN "winning_tickets"`);
	}
}
