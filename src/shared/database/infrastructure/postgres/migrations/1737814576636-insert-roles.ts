import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertRoles1737814576636 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      INSERT INTO roles (id, name, description) VALUES
        (1, 'admin', 'Administrador con acceso completo a la plataforma'),
        (2, 'user', 'Usuario básico con permisos para participar en rifas');
    `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            DELETE FROM roles WHERE name IN ('admin', 'user');
    `);
	}
}
