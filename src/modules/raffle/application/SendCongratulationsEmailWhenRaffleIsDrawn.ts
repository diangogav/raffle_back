import { UserRepository } from "src/modules/user/domain/UserRepository";
import { EmailSender } from "src/shared/email/domain/EmailSender";
import { WinnerEmailTemplate } from "src/shared/email/domain/WinnerEmailTemplate";
import { Logger } from "src/shared/logger/domain/Logger";

import { RaffleDrawnDomainEvent } from "../domain/RaffleDrawnDomainEvent";
import { RaffleRepository } from "../domain/RaffleRepository";

export class SendCongratulationsEmailWhenRaffleIsDrawn {
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
			const tickets = await this.raffleRepository.getTicketsByIds(event.data.winnerTickets);

			for (const ticket of tickets) {
				// eslint-disable-next-line no-await-in-loop
				const user = await this.userRepository.findById(ticket.userId);

				if (!user) {
					continue;
				}

				const winnerTemplate = new WinnerEmailTemplate({
					drawName: event.data.raffleTitle,
					drawNumber: 1,
					drawPrice: event.data.rafflePrice,
					winnerName: user.name,
					totalParticipants: event.data.totalTickets,
					winnerNumber: ticket.ticketNumber,
				});

				void this.emailSender.send({ template: winnerTemplate, to: user.email });
			}
		} catch (error) {
			this.logger.error(error);
		}
	}
}
