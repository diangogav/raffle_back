import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedStatusColumnToRaffleTable1731703799069 implements MigrationInterface {
	name = "AddedStatusColumnToRaffleTable1731703799069";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."raffles_status_enum" AS ENUM('PENDING', 'ONGOING', 'CLOSED', 'DRAWN', 'WINNER_CONFIRMED', 'CANCELED', 'UNDER_REVIEW', 'PRIZE_DELIVERED')`,
		);
		await queryRunner.query(
			`ALTER TABLE "raffles" ADD "status" "public"."raffles_status_enum" NOT NULL DEFAULT 'PENDING'`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "raffles" DROP COLUMN "status"`);
		await queryRunner.query(`DROP TYPE "public"."raffles_status_enum"`);
	}
}
