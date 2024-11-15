import { Raffle } from "../domain/Raffle";
import { RaffleRepository } from "../domain/RaffleRepository";

export class OngoingRafflesGetter {
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
		return await this.repository.getOngoingRafflesSortedBy({
			field,
			direction,
			limit,
			page,
		});
	}
}
