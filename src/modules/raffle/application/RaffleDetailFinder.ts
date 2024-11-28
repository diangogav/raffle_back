import { NotFoundError } from "../../../shared/errors";
import { RaffleRepository } from "../domain/RaffleRepository";

export class RaffleDetailFinder {
	constructor(private readonly repository: RaffleRepository) {}

	async get({ raffleId }: { raffleId: string }): Promise<unknown> {
		const raffle = await this.repository.findById(raffleId);
		if (!raffle) {
			throw new NotFoundError("Raffle not found");
		}

		return raffle.detailPresentation();
	}
}
