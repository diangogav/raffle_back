import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedTicketsTable1732203318468 implements MigrationInterface {
	name = "AddedTicketsTable1732203318468";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "tickets" ("id" uuid NOT NULL, "ticket_number" character varying NOT NULL, "user_id" uuid NOT NULL, "raffle_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "tickets" ADD CONSTRAINT "FK_2e445270177206a97921e461710" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "tickets" ADD CONSTRAINT "FK_f0635a81c8f1e105c1b872a2178" FOREIGN KEY ("raffle_id") REFERENCES "raffles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_f0635a81c8f1e105c1b872a2178"`);
		await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_2e445270177206a97921e461710"`);
		await queryRunner.query(`DROP TABLE "tickets"`);
	}
}
