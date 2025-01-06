import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameVerifiedToStatus1736124062138 implements MigrationInterface {
	name = "RenameVerifiedToStatus1736124062138";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "payments" RENAME COLUMN "verified" TO "status"`);
		await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "status"`);
		await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('APPROVE', 'DENIED', 'PENDING')`);
		await queryRunner.query(
			`ALTER TABLE "payments" ADD "status" "public"."payments_status_enum" NOT NULL DEFAULT 'PENDING'`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "status"`);
		await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
		await queryRunner.query(`ALTER TABLE "payments" ADD "status" boolean NOT NULL DEFAULT false`);
		await queryRunner.query(`ALTER TABLE "payments" RENAME COLUMN "status" TO "verified"`);
	}
}
