import { PaymentEntity } from "../../../shared/database/infrastructure/postgres/entities/PaymentEntity";
import { PostgresTypeORMRepository } from "../../../shared/database/infrastructure/postgres/PostgresTypeORMRepository";
import { Payment } from "../domain/Payment";
import { PaymentRepository } from "../domain/PaymentRepository";

export class PaymentPostgresRepository extends PostgresTypeORMRepository implements PaymentRepository {
	async save(payment: Payment): Promise<void> {
		const repository = this.getRepository(PaymentEntity);
		const paymentEntity = repository.create({
			id: payment.id,
			reference: payment.reference,
			amount: payment.amount,
			paymentMethod: payment.paymentMethod,
			name: payment.name,
			dni: payment.dni,
			phone: payment.phone,
			email: payment.email,
			userId: payment.userId,
			createdAt: payment.createdAt,
			updatedAt: payment.updatedAt,
		});

		await repository.save(paymentEntity);
	}
}
