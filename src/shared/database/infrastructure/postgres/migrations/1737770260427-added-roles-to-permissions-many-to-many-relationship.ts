import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRolesToPermissionsManyToManyRelationship1737770260427 implements MigrationInterface {
	name = "AddedRolesToPermissionsManyToManyRelationship1737770260427";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "role_permissions" ("role_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id"))`,
		);
		await queryRunner.query(`CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id") `);
		await queryRunner.query(
			`CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id") `,
		);
		await queryRunner.query(
			`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
		await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_17022daf3f885f7d35423e9971"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_178199805b901ccd220ab7740e"`);
		await queryRunner.query(`DROP TABLE "role_permissions"`);
	}
}
