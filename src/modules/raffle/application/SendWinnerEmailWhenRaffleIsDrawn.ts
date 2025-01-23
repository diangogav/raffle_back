import { EmailSender } from "../../../shared/email/domain/EmailSender";
import { DomainEventSubscriber } from "../../../shared/event-bus/infrastructure/InMemoryEventBus";
import { Logger } from "../../../shared/logger/domain/Logger";
import { UserRepository } from "../../user/domain/UserRepository";
import { RaffleDrawnDomainEvent } from "../domain/RaffleDrawnDomainEvent";
import { RaffleDrawnTemplate } from "../domain/RaffleDrawnTemplate";
import { RaffleRepository } from "../domain/RaffleRepository";

export class SendWinnerEmailWhenRaffleIsDrawn implements DomainEventSubscriber<RaffleDrawnDomainEvent> {
	static readonly ListenTo = RaffleDrawnDomainEvent.DOMAIN_EVENT;

	constructor(
		private readonly raffleRepository: RaffleRepository,
		private readonly userRepository: UserRepository,
		private readonly emailSender: EmailSender,
		private readonly logger: Logger,
	) {}

	async handle(event: RaffleDrawnDomainEvent): Promise<void> {
		try {
			this.logger.info(JSON.stringify(event));
			const tickets = await this.raffleRepository.getTickets(event.data.raffleId);
			const userIds = [...new Set([...tickets.map((ticket) => ticket.userId)])];
			this.logger.info(userIds);
			const users = await this.userRepository.findByIds(userIds);
			const winnerTicket = tickets.find((ticket) => ticket.id === event.data.winnerTickets[0]);

			if (!winnerTicket) {
				return;
			}

			for (const user of users) {
				const template = new RaffleDrawnTemplate({
					raffleTitle: event.data.raffleTitle,
					raffleCover: event.data.raffleCover,
					winnerTicketNumber: winnerTicket.ticketNumber,
				});

				void this.emailSender.send({ template, to: user.email });
			}
		} catch (error) {
			this.logger.error(error);
		}
	}
}
