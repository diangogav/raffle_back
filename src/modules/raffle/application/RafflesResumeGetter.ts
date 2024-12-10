import { RaffleRepository } from "../domain/RaffleRepository";
import { RaffleStatus } from "../domain/RaffleStatus.enum";

export class RafflesResumeGetter {
	constructor(private readonly repository: RaffleRepository) {}

	async get({ userId, statuses }: { userId: string; statuses: RaffleStatus[] }): Promise<unknown[]> {
		const raffles = await this.repository.rafflesWithTickets(userId, statuses);

		return raffles.map((raffle) => raffle.detailPresentation());
	}
}
