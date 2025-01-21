import { DomainEventSubscriber } from "../../../shared/event-bus/infrastructure/InMemoryEventBus";
import { Logger } from "../../../shared/logger/domain/Logger";
import { UserRepository } from "../../user/domain/UserRepository";
import { RaffleDrawnDomainEvent } from "../domain/RaffleDrawnDomainEvent";
import { RaffleRepository } from "../domain/RaffleRepository";

export class SendWinnerEmailWhenRaffleIsDrawn implements DomainEventSubscriber<RaffleDrawnDomainEvent> {
	static readonly ListenTo = RaffleDrawnDomainEvent.DOMAIN_EVENT;

	constructor(
		private readonly raffleRepository: RaffleRepository,
		private readonly userRepository: UserRepository,
		private readonly logger: Logger,
	) {}

	async handle(event: RaffleDrawnDomainEvent): Promise<void> {
		try {
			this.logger.info(JSON.stringify(event));
			const tickets = await this.raffleRepository.getTickets(event.data.raffleId);
			const userIds = [...new Set([...tickets.map((ticket) => ticket.userId)])];
			const users = await this.userRepository.findByIds(userIds);
			this.logger.info(users);
		} catch (error) {
			this.logger.error(error);
		}
	}
}
