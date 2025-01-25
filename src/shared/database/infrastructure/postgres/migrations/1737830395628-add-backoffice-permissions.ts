import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBackofficePermissions1737830395628 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
        INSERT INTO permissions (id, name, description) VALUES
            (10, 'backoffice.read.user.ticket', 'Permiso para leer tickets de usuario en el backoffice'),
            (11, 'backoffice.read.user', 'Permiso para leer información de usuario en el backoffice');
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
        DELETE FROM permissions WHERE name IN (
            'backoffice.read.user.ticket',
            'backoffice.read.user'
        );
    `);
	}
}
