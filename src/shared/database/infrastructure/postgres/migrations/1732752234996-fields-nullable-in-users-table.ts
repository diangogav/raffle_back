import { MigrationInterface, QueryRunner } from "typeorm";

export class FieldsNullableInUsersTable1732752234996 implements MigrationInterface {
	name = "FieldsNullableInUsersTable1732752234996";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_name" DROP NOT NULL`);
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "address" DROP NOT NULL`);
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL`);
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "dni" DROP NOT NULL`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "dni" SET NOT NULL`);
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL`);
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "address" SET NOT NULL`);
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_name" SET NOT NULL`);
	}
}
