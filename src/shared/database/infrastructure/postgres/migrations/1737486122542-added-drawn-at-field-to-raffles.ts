import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedDrawnAtFieldToRaffles1737486122542 implements MigrationInterface {
	name = "AddedDrawnAtFieldToRaffles1737486122542";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "raffles" ADD "drawn_at" TIMESTAMP`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "raffles" DROP COLUMN "drawn_at"`);
	}
}
