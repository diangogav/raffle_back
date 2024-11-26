import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameLastNameInUsersTable1732636503422 implements MigrationInterface {
	name = "RenameLastNameInUsersTable1732636503422";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "lastName" TO "last_name"`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "last_name" TO "lastName"`);
	}
}
