import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeStatusEnum1733859841319 implements MigrationInterface {
	name = "ChangeStatusEnum1733859841319";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TYPE "public"."raffles_status_enum" RENAME TO "raffles_status_enum_old"`);
		await queryRunner.query(
			`CREATE TYPE "public"."raffles_status_enum" AS ENUM('PENDING', 'ONGOING', 'CLOSED', 'DRAWN', 'WINNER_CONFIRMED', 'CANCELED', 'FINISHED')`,
		);
		await queryRunner.query(`ALTER TABLE "raffles" ALTER COLUMN "status" DROP DEFAULT`);
		await queryRunner.query(
			`ALTER TABLE "raffles" ALTER COLUMN "status" TYPE "public"."raffles_status_enum" USING "status"::"text"::"public"."raffles_status_enum"`,
		);
		await queryRunner.query(`ALTER TABLE "raffles" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
		await queryRunner.query(`DROP TYPE "public"."raffles_status_enum_old"`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."raffles_status_enum_old" AS ENUM('PENDING', 'ONGOING', 'CLOSED', 'DRAWN', 'WINNER_CONFIRMED', 'CANCELED', 'UNDER_REVIEW', 'PRIZE_DELIVERED')`,
		);
		await queryRunner.query(`ALTER TABLE "raffles" ALTER COLUMN "status" DROP DEFAULT`);
		await queryRunner.query(
			`ALTER TABLE "raffles" ALTER COLUMN "status" TYPE "public"."raffles_status_enum_old" USING "status"::"text"::"public"."raffles_status_enum_old"`,
		);
		await queryRunner.query(`ALTER TABLE "raffles" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
		await queryRunner.query(`DROP TYPE "public"."raffles_status_enum"`);
		await queryRunner.query(`ALTER TYPE "public"."raffles_status_enum_old" RENAME TO "raffles_status_enum"`);
	}
}
