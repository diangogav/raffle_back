import { dataSource } from "../../../../shared/database/infrastructure/postgres/data-source";
import { TicketEntity } from "../../../../shared/database/infrastructure/postgres/entities/TicketEntity";
import { Ticket } from "../domain/Ticket";
import { TicketRepository } from "../domain/TicketRepository";

export class TicketPostgresRepository implements TicketRepository {
	async getByRaffleId(raffleId: string): Promise<Ticket[]> {
		const repository = dataSource.getRepository(TicketEntity);

		const tickets = await repository.find({
			where: {
				raffleId,
			},
		});

		return tickets.map((ticket) => Ticket.from(ticket));
	}
}
