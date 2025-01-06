import { Payment } from "src/modules/payment/domain/Payment";

import { TicketBackOffice } from "../domain/TicketBackOffice";
import { TicketBackOfficeRepository } from "../domain/TicketBackOfficeRepository";

import { dataSource } from "./../../../shared/database/infrastructure/postgres/data-source";
import { PaymentEntity } from "./../../../shared/database/infrastructure/postgres/entities/PaymentEntity";
import { TicketEntity } from "./../../../shared/database/infrastructure/postgres/entities/TicketEntity";
import { PostgresTypeORMRepository } from "./../../../shared/database/infrastructure/postgres/PostgresTypeORMRepository";
import { PaymentFactory } from "./../../payment/domain/PaymentFactory";

export class TicketBackOfficePostgresRepository
	extends PostgresTypeORMRepository
	implements TicketBackOfficeRepository
{
	async get({ userId }: { userId: string }): Promise<TicketBackOffice[]> {
		const repository = dataSource.getRepository(TicketEntity);
		const ticketsEntities = await repository.query(`
      SELECT 
        tickets.id, 
        tickets.ticket_number, 
        tickets.user_id, 
        tickets.created_at, 
        payments.status, 
        payments.reference as payment_reference, 
        payments.id as payment_id, 
        raffles.id as raffle_id, 
        raffles.title as raffle_title, 
        raffles.end_date as raffle_end_date
      FROM tickets
      JOIN payments on tickets.payment_id = payments.id
      JOIN raffles on tickets.raffle_id = raffles.id
      WHERE tickets.user_id = '${userId}' AND payments.status = 'PENDING';
    `);

		const tickets = ticketsEntities.map((ticket) =>
			TicketBackOffice.from({
				...ticket,
				userId: ticket.user_id,
				createdAt: ticket.created_at,
				paymentReference: ticket.payment_reference,
				paymentId: ticket.payment_id,
				raffleId: ticket.raffle_id,
				raffleTitle: ticket.raffle_title,
				ticketNumber: ticket.ticket_number,
				raffleEndDate: ticket.raffle_end_date,
			}),
		);

		return tickets;
	}

	async update(payment: Payment): Promise<void> {
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
			status: payment.status,
		});

		await repository.save(paymentEntity);
	}

	async getTicketPayment({ ticketId }: { ticketId: string }): Promise<Payment | null> {
		const repository = dataSource.getRepository(TicketEntity);

		const entity = await repository.query(`
			select 
				payments.id as payment_id, 
				payments.reference as payment_reference, 
				payments.amount as payment_amount,
				payments.name as payment_name,
				payments.payment_method,
				payments.dni as payment_dni,
				payments.phone as payment_phone,
				payments.email as payment_email,
				payments.user_id as payment_user_id,
				payments.status as payment_status,
				payments.created_at as payment_created_at,
				payments.updated_at as payment_updated_at
			from tickets
			join payments on payments.id = tickets.payment_id
			where tickets.id = '${ticketId}';
		`);

		const payment = entity[0];

		if (!payment) {
			return null;
		}

		return PaymentFactory.from({
			id: payment.payment_id,
			reference: payment.payment_reference,
			amount: payment.payment_amount,
			paymentMethod: payment.payment_method,
			name: payment.payment_name,
			dni: payment.payment_dni,
			phone: payment.payment_phone,
			email: payment.payment_email,
			userId: payment.payment_user_id,
			status: payment.payment_status,
			createdAt: payment.payment_created_at,
			updatedAt: payment.payment_updated_at,
		});
	}

	async deleteTicket({ ticketId }: { ticketId: string }): Promise<void> {
		const repository = this.getRepository(TicketEntity);

		await repository.delete(ticketId);
	}
}
