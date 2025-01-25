import { MigrationInterface, QueryRunner } from "typeorm";

export class RolePermissionsJoin1737819955404 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const adminRole = await queryRunner.query("SELECT id FROM roles WHERE name = 'admin'");

		const allPermissions = await queryRunner.query("SELECT id FROM permissions");

		for (const permission of allPermissions) {
			// eslint-disable-next-line no-await-in-loop
			await queryRunner.query(`
                INSERT INTO role_permissions (role_id, permission_id) VALUES (${adminRole[0].id}, ${permission.id});
            `);
		}

		const userRole = await queryRunner.query("SELECT id FROM roles WHERE name = 'user'");

		const userPermissions = await queryRunner.query(`
            SELECT id FROM permissions WHERE name IN ('create.ticket', 'read.ticket', 'read.raffle', 'update.user')
        `);

		for (const permission of userPermissions) {
			// eslint-disable-next-line no-await-in-loop
			await queryRunner.query(`
                INSERT INTO role_permissions (role_id, permission_id) VALUES (${userRole[0].id}, ${permission.id});
            `);
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const userRole = await queryRunner.query("SELECT id FROM roles WHERE name = 'user'");
		const userPermissions = await queryRunner.query(`
            SELECT id FROM permissions WHERE name IN ('create.ticket', 'read.ticket', 'read.raffle', 'update.user')
        `);

		for (const permission of userPermissions) {
			// eslint-disable-next-line no-await-in-loop
			await queryRunner.query(`
                DELETE FROM role_permissions WHERE role_id = ${userRole[0].id} AND permission_id = ${permission.id};
            `);
		}

		const adminRole = await queryRunner.query("SELECT id FROM roles WHERE name = 'admin'");
		const allPermissions = await queryRunner.query("SELECT id FROM permissions");

		for (const permission of allPermissions) {
			// eslint-disable-next-line no-await-in-loop
			await queryRunner.query(`
                DELETE FROM role_permissions WHERE role_id = ${adminRole[0].id} AND permission_id = ${permission.id};
            `);
		}
	}
}
