import { Schedulable } from "../../../shared/cron/domain/Schedulable";
import { EventBus } from "../../../shared/event-bus/domain/EventBus";
import { Logger } from "../../../shared/logger/domain/Logger";
import { RaffleDrawnDomainEvent } from "../domain/RaffleDrawnDomainEvent";
import { RaffleRepository } from "../domain/RaffleRepository";
import { RaffleStatus } from "../domain/RaffleStatus.enum";

export class DrawRaffles implements Schedulable {
	constructor(
		private readonly repository: RaffleRepository,
		private readonly logger: Logger,
		private readonly eventBus: EventBus,
	) {}

	async execute(): Promise<void> {
		try {
			this.logger.info("Searching pending raffles");

			const closedRaffles = await this.repository.getRafflesByStatusAndEndDateGreaterThan(
				RaffleStatus.CLOSED,
				new Date(),
				100,
				1,
			);

			const sortableRaffles = await this.repository.getRafflesByStatusAndEndDateGreaterThan(
				RaffleStatus.SORTABLE,
				new Date(),
				100,
				1,
			);

			const raffles = [...closedRaffles, ...sortableRaffles];

			this.logger.info(`Drawing raffles with ids: ${raffles.map((item) => item.id).join(" ")}`);

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

			for (const raffle of raffles) {
				this.eventBus.publish(
					RaffleDrawnDomainEvent.DOMAIN_EVENT,
					new RaffleDrawnDomainEvent({
						winnerTickets: raffle.winningTickets,
						raffleId: raffle.id,
						raffleTitle: raffle.title,
						raffleCover: raffle.cover,
						drawnAt: raffle.drawnAt as Date,
					}),
				);
			}
		} catch (error) {
			this.logger.error(`Error error drawing the raffles`);
			this.logger.error(error);
		}
	}
}
