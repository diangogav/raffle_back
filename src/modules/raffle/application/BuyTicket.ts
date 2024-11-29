import { ConflictError } from "../../../shared/errors";
import { RaffleRepository } from "../domain/RaffleRepository";

import { BuyTicketRequestDto } from "./dtos/BuyTicketRequestDto";

export class BuyTicket {
	constructor(private readonly repository: RaffleRepository) {}

	async buy({ ticketNumbers, raffleId, userId }: BuyTicketRequestDto): Promise<void> {
		const raffle = await this.repository.findById(raffleId);

		if (!raffle) {
			throw new ConflictError(`Raffle with id ${raffleId} not found`);
		}

		const tickets = ticketNumbers.map((ticketNumber) => raffle.takeTicket(ticketNumber, userId));

		await Promise.allSettled(tickets.map((ticket) => this.repository.saveTicket(ticket)));
	}
}
