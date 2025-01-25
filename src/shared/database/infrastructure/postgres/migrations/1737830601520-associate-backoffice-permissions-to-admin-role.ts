import { MigrationInterface, QueryRunner } from "typeorm";

export class AssociateBackofficePermissionsToAdminRole1737830601520 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const adminRole = await queryRunner.query("SELECT id FROM roles WHERE name = 'admin'");

		const backofficeReadUserTicketPermission = await queryRunner.query(
			"SELECT id FROM permissions WHERE name = 'backoffice.read.user.ticket'",
		);
		const backofficeReadUserPermission = await queryRunner.query(
			"SELECT id FROM permissions WHERE name = 'backoffice.read.user'",
		);

		await queryRunner.query(`
            INSERT INTO role_permissions (role_id, permission_id) VALUES
                (${adminRole[0].id}, ${backofficeReadUserTicketPermission[0].id}),
                (${adminRole[0].id}, ${backofficeReadUserPermission[0].id});
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const adminRole = await queryRunner.query("SELECT id FROM roles WHERE name = 'admin'");

		const backofficeReadUserTicketPermission = await queryRunner.query(
			"SELECT id FROM permissions WHERE name = 'backoffice.read.user.ticket'",
		);
		const backofficeReadUserPermission = await queryRunner.query(
			"SELECT id FROM permissions WHERE name = 'backoffice.read.user'",
		);

		await queryRunner.query(`
            DELETE FROM role_permissions WHERE role_id = ${adminRole[0].id} AND permission_id IN (
                ${backofficeReadUserTicketPermission[0].id},
                ${backofficeReadUserPermission[0].id}
            );
        `);
	}
}
