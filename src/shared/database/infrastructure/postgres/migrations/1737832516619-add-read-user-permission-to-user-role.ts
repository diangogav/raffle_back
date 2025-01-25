import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReadUserPermissionToUserRole1737832516619 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const userRole = await queryRunner.query("SELECT id FROM roles WHERE name = 'user'");

		const readUserPermission = await queryRunner.query("SELECT id FROM permissions WHERE name = 'read.user'");

		await queryRunner.query(`
            INSERT INTO role_permissions (role_id, permission_id) VALUES
                (${userRole[0].id}, ${readUserPermission[0].id});
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const userRole = await queryRunner.query("SELECT id FROM roles WHERE name = 'user'");

		const readUserPermission = await queryRunner.query("SELECT id FROM permissions WHERE name = 'read.user'");

		await queryRunner.query(`
            DELETE FROM role_permissions WHERE role_id = ${userRole[0].id} AND permission_id IN (
                ${readUserPermission[0].id}
            );
        `);
	}
}
