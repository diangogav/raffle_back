import { Raffle } from "../domain/Raffle";
import { RaffleRepository } from "../domain/RaffleRepository";

export class MostRecentRaffleGetter {
	constructor(private readonly repository: RaffleRepository) {}

	async get({
		limit,
		page,
		field,
		direction,
	}: {
		limit: number;
		page: number;
		field: string;
		direction: "ASC" | "DESC";
	}): Promise<Raffle[]> {
		return await this.repository.getSortedBy({
			field,
			direction,
			limit,
			page,
		});
	}
}
