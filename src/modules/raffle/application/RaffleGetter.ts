import { ExchangeRateRepository } from "../../../shared/exchange-rate/domain/ExchangeRateRepository";
import { RafflePresentation } from "../domain/Raffle";
import { RaffleRepository } from "../domain/RaffleRepository";
import { RaffleStatus } from "../domain/RaffleStatus.enum";

export class RaffleGetter {
	constructor(
		private readonly repository: RaffleRepository,
		private readonly exchangeRateRepository: ExchangeRateRepository,
	) {}

	async get({
		limit,
		page,
		field,
		direction,
		statuses,
	}: {
		limit: number;
		page: number;
		field: string;
		direction: "ASC" | "DESC";
		statuses: RaffleStatus[];
	}): Promise<RafflePresentation[]> {
		const exchangeRate = await this.exchangeRateRepository.dollarToBCVRate();

		const raffles = await this.repository.getRafflesSortedBy({
			field,
			direction,
			limit,
			page,
			statuses,
		});

		return raffles.map((raffle) => raffle.toJson(exchangeRate));
	}
}
