import { RaffleRepository } from "../domain/RaffleRepository";

export class RafflesResumeGetter {
	constructor(private readonly repository: RaffleRepository) {}

	async get({ userId }: { userId: string }): Promise<unknown[]> {
		const raffles = await this.repository.rafflesWithTickets(userId);

		return raffles.map((raffle) => raffle.detailPresentation());
	}
}
