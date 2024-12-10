import { dataSource } from "../../../shared/database/infrastructure/postgres/data-source";
import { PaymentEntity } from "../../../shared/database/infrastructure/postgres/entities/PaymentEntity";
import { Payment } from "../domain/Payment";
import { PaymentRepository } from "../domain/PaymentRepository";

export class PaymentPostgresRepository implements PaymentRepository {
	async save(payment: Payment): Promise<void> {
		const repository = dataSource.getRepository(PaymentEntity);
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
