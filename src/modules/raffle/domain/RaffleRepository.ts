import { Raffle } from "./Raffle";

export interface RaffleRepository {
	save(raffle: Raffle): Promise<void>;
}
