import { TicketRepository } from "../domain/TicketRepository";

export class RaffleTicketsGetter {
	constructor(private readonly ticketRepository: TicketRepository) {}

	async get({ raffleId }: { raffleId: string }): Promise<unknown> {
		return this.ticketRepository.getByRaffleId(raffleId);
	}
}
