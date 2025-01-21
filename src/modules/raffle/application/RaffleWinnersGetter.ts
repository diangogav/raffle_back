import { NotFoundError } from "../../../shared/errors";
import { RaffleRepository } from "../domain/RaffleRepository";
import { RaffleWinners } from "../domain/RaffleWinners";

export class RaffleWinnersGetter {
	constructor(private readonly repository: RaffleRepository) {}

	async get({ raffleId }: { raffleId: string }): Promise<RaffleWinners> {
		const raffle = await this.repository.findById(raffleId);

		if (!raffle) {
			throw new NotFoundError(`Raffle with id ${raffleId} not found`);
		}

		const winnerTickets = await this.repository.getTicketsByIds(raffle.winningTickets);

		return {
			title: raffle.title,
			cover: raffle.cover,
			winnerTickets: winnerTickets.map((item) => ({
				ticketId: item.id,
				ticketNumber: item.ticketNumber,
			})),
		};
	}
}
