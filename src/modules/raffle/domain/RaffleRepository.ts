import { Raffle } from "./Raffle";

export interface RaffleRepository {
	save(raffle: Raffle): Promise<void>;
	getOngoingRafflesSortedBy({
		field,
		direction,
		limit,
		page,
	}: {
		field: string;
		direction: "ASC" | "DESC";
		limit: number;
		page: number;
	}): Promise<Raffle[]>;
}
