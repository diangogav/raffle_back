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
		try {
			this.logger.info("Searching pending raffles");

			const raffles = await this.repository.getRafflesByStatusAndEndDateGreaterThan(
				RaffleStatus.CLOSED,
				new Date(),
				100,
				1,
			);

			for (const raffle of raffles) {
				const winnerTicket = raffle.draw();
				this.logger.info(`
					winner ticket for raffle: ${raffle.id} : ${raffle.title} is
					ticket with number ${winnerTicket.ticketNumber} with
					userId: ${winnerTicket.userId}
				`);

				// eslint-disable-next-line no-await-in-loop
				await this.repository.save(raffle);
			}
		} catch (error) {
			this.logger.error(`Error error drawing the raffles`);
			this.logger.error(error);
		}
	}
}
