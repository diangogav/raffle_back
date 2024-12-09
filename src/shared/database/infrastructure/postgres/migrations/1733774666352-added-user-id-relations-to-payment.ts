import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUserIdRelationsToPayment1733774666352 implements MigrationInterface {
	name = "AddedUserIdRelationsToPayment1733774666352";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "payments" ADD "email" character varying`);
		await queryRunner.query(`ALTER TABLE "payments" ADD "user_id" uuid NOT NULL`);
		await queryRunner.query(`ALTER TABLE "payments" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
		await queryRunner.query(`ALTER TABLE "payments" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
		await queryRunner.query(`ALTER TABLE "payments" ADD "deleted_at" TIMESTAMP`);
		await queryRunner.query(
			`ALTER TABLE "payments" ADD CONSTRAINT "FK_427785468fb7d2733f59e7d7d39" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_427785468fb7d2733f59e7d7d39"`);
		await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "deleted_at"`);
		await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "updated_at"`);
		await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "created_at"`);
		await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "user_id"`);
		await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "email"`);
	}
}
