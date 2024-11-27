import { RaffleRepository } from "../domain/RaffleRepository";

export class RaffleDetailFinder {
	constructor(private readonly repository: RaffleRepository) {}

	async get({ raffleId }: { raffleId: string }): Promise<unknown> {
		const raffle = await this.repository.findById(raffleId);
		if (!raffle) {
			throw new Error("Raffle not found");
		}

		const tickets = await this.repository.getTickets(raffleId);

		return {
			...raffle,
			tickets,
		};
	}
}
