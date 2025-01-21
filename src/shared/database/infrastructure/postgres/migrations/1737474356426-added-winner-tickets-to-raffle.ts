import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedWinnerTicketsToRaffle1737474356426 implements MigrationInterface {
	name = "AddedWinnerTicketsToRaffle1737474356426";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "raffles" ADD "winning_tickets" json NOT NULL DEFAULT '[]'`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "raffles" DROP COLUMN "winning_tickets"`);
	}
}
