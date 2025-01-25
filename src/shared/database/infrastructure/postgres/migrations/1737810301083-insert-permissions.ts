import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertPermissions1737810301083 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
		  INSERT INTO permissions (id, name, description) VALUES
			(1, 'create.ticket', 'Permiso para crear un ticket'),
			(2, 'read.ticket', 'Permiso para leer un ticket'),
			(3, 'approve.ticket.payment', 'Permiso para aprobar el pago de un ticket'),
			(4, 'deny.ticket.payment', 'Permiso para denegar el pago de un ticket');
	
		  INSERT INTO permissions (id, name, description) VALUES
			(5, 'read.raffle', 'Permiso para leer una rifa'),
			(6, 'create.raffle', 'Permiso para crear una rifa');
	
		  INSERT INTO permissions (id, name, description) VALUES
			(7, 'read.user', 'Permiso para leer un usuario'),
			(8, 'create.user', 'Permiso para crear un usuario'),
			(9, 'update.user', 'Permiso para actualizar un usuario');
    `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
		  DELETE FROM permissions WHERE name IN (
			'create.ticket',
			'read.ticket',
			'approve.ticket.payment',
			'deny.ticket.payment',
			'read.raffle',
			'create.raffle',
			'read.user',
			'create.user',
			'update.user'
		  );
    `);
	}
}
