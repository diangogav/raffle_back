import { NotFoundError } from "../../../shared/errors";
import { ExchangeRateRepository } from "../../../shared/exchange-rate/domain/ExchangeRateRepository";
import { RaffleRepository } from "../domain/RaffleRepository";

export class RaffleDetailFinder {
	constructor(
		private readonly repository: RaffleRepository,
		private readonly exchangeRateRepository: ExchangeRateRepository,
	) {}

	async get({ raffleId }: { raffleId: string }): Promise<unknown> {
		const exchangeRate = await this.exchangeRateRepository.dollarToBCVRate();

		const raffle = await this.repository.findById(raffleId);
		if (!raffle) {
			throw new NotFoundError("Raffle not found");
		}

		return raffle.detailPresentation(exchangeRate);
	}
}
