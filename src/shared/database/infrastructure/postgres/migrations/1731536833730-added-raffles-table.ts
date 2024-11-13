import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRafflesTable1731536833730 implements MigrationInterface {
	name = "AddedRafflesTable1731536833730";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "raffles" ("id" uuid NOT NULL, "title" character varying NOT NULL, "description" character varying, "ticket_price" numeric NOT NULL, "end_date" TIMESTAMP NOT NULL, "total_tickets" numeric NOT NULL, "user_id" uuid NOT NULL, "cover" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_052c636fce78a0481c29fab2aa1" PRIMARY KEY ("id"))`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "raffles"`);
	}
}
