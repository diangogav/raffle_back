import { RafflePresentation } from "../domain/Raffle";
import { RaffleRepository } from "../domain/RaffleRepository";

import { ExchangeRateRepository } from "./../../../shared/exchange-rate/domain/ExchangeRateRepository";

export class OngoingRafflesGetter {
	constructor(
		private readonly repository: RaffleRepository,
		private readonly exchangeRateRepository: ExchangeRateRepository,
	) {}

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
	}): Promise<RafflePresentation[]> {
		const exchangeRate = await this.exchangeRateRepository.dollarToBCVRate();

		const raffles = await this.repository.getOngoingRafflesSortedBy({
			field,
			direction,
			limit,
			page,
		});

		return raffles.map((raffle) => raffle.toJson(exchangeRate));
	}
}
