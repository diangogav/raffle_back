import { TicketBackOffice } from "../domain/TicketBackOffice";
import { TicketBackOfficeRepository } from "../domain/TicketBackOfficeRepository";

import { dataSource } from "./../../../shared/database/infrastructure/postgres/data-source";
import { TicketEntity } from "./../../../shared/database/infrastructure/postgres/entities/TicketEntity";

export class TicketBackOfficePostgresRepository implements TicketBackOfficeRepository {
	async get({ userId }: { userId: string }): Promise<TicketBackOffice[]> {
		const repository = dataSource.getRepository(TicketEntity);
		const ticketsEntities = await repository.query(`
      SELECT 
        tickets.id, 
        tickets.ticket_number, 
        tickets.user_id, 
        tickets.created_at, 
        payments.verified, 
        payments.reference as payment_reference, 
        payments.id as payment_id, 
        raffles.id as raffle_id, 
        raffles.title as raffle_title, 
        raffles.end_date as raffle_end_date
      FROM tickets
      JOIN payments on tickets.payment_id = payments.id
      JOIN raffles on tickets.raffle_id = raffles.id
      WHERE tickets.user_id = '${userId}';
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
}
