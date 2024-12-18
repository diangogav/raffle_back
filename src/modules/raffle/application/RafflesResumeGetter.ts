import { RaffleRepository } from "../domain/RaffleRepository";
import { RaffleStatus } from "../domain/RaffleStatus.enum";

import { ExchangeRateRepository } from "./../../../shared/exchange-rate/domain/ExchangeRateRepository";

export class RafflesResumeGetter {
	constructor(
		private readonly repository: RaffleRepository,
		private readonly exchangeRateRepository: ExchangeRateRepository,
	) {}

	async get({ userId, statuses }: { userId: string; statuses: RaffleStatus[] }): Promise<unknown[]> {
		const exchangeRate = await this.exchangeRateRepository.dollarToBCVRate();

		const raffles = await this.repository.rafflesWithTickets(userId, statuses);

		return raffles.map((raffle) => raffle.detailPresentation(exchangeRate));
	}
}
