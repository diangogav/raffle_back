import { Schedulable } from "../../../shared/cron/domain/Schedulable";
import { Logger } from "../../../shared/logger/domain/Logger";
import { RaffleRepository } from "../domain/RaffleRepository";
import { RaffleStatus } from "../domain/RaffleStatus.enum";

export class DrawClosedRaffles implements Schedulable {
	constructor(
		private readonly repository: RaffleRepository,
		private readonly logger: Logger,
	) {}

	async execute(): Promise<void> {
		this.logger.info("Searching pending raffles");

		const raffles = await this.repository.getRafflesByStatusAndEndDateGreaterThan(
			RaffleStatus.CLOSED,
			new Date(),
			100,
			1,
		);

		for (const raffle of raffles) {
			const winnerTicket = raffle.selectWinner();
			this.logger.info(winnerTicket);
		}
	}
}
