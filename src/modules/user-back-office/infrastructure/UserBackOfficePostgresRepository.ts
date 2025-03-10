import { dataSource } from "../../../shared/database/infrastructure/postgres/data-source";
import { UserEntity } from "../../../shared/database/infrastructure/postgres/entities/UserEntity";
import { PaymentStatus } from "../../payment/domain/PaymentStatus";
import { UserBackOffice } from "../domain/UserBackOffice";
import { UserBackOfficeRepository } from "../domain/UserBackOfficeRepository";

export class UserBackOfficePostgresRepository implements UserBackOfficeRepository {
	async get(): Promise<UserBackOffice[]> {
		const repository = dataSource.getRepository(UserEntity);
		const userEntities = await repository.query(`
      		SELECT users.id, users.name, users.last_name, users.email, users.phone, COUNT(tickets.id) AS unverified_tickets_count 
      		FROM users
      		JOIN tickets ON users.id = tickets.user_id
      		JOIN payments ON tickets.payment_id = payments.id
			WHERE payments.status = '${PaymentStatus.PENDING}'
      		GROUP BY users.id;
    `);

		return userEntities.map((user) =>
			UserBackOffice.from({ ...user, unverifiedTicketsCount: +user.unverified_tickets_count }),
		);
	}
}
