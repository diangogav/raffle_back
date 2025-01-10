import { EmailSender } from "../../../shared/email/domain/EmailSender";
import { PaymentApprovedTemplate } from "../../../shared/email/domain/PaymentApprovedTemplate";
import { DomainEventSubscriber } from "../../../shared/event-bus/infrastructure/InMemoryEventBus";
import { Logger } from "../../../shared/logger/domain/Logger";
import { UserFinderDomainService } from "../../../shared/user/domain/UserFinderDomainService";
import { TicketPaymentApprovedDomainEvent } from "../domain/TicketPaymentApprovedDomainEvent";

import { RaffleRepository } from "./../../raffle/domain/RaffleRepository";

export class SendEmailWhenTicketPaymentApproved implements DomainEventSubscriber<TicketPaymentApprovedDomainEvent> {
	static readonly ListenTo = TicketPaymentApprovedDomainEvent.DOMAIN_EVENT;

	constructor(
		private readonly logger: Logger,
		private readonly userFinderDomainService: UserFinderDomainService,
		private readonly raffleRepository: RaffleRepository,
		private readonly emailSender: EmailSender,
	) {}

	async handle(event: TicketPaymentApprovedDomainEvent): Promise<void> {
		try {
			this.logger.info(JSON.stringify(event));

			const user = await this.userFinderDomainService.find({ userId: event.data.userId });

			const tickets = await this.raffleRepository.getTicketsByPaymentId(event.data.paymentId);

			if (!tickets.length) {
				return;
			}

			const raffle = await this.raffleRepository.findById(tickets[0].raffleId);

			if (!raffle) {
				return;
			}

			await this.emailSender.send({
				template: new PaymentApprovedTemplate({
					name: user.name,
					ticketNumbers: tickets.map((ticket) => ticket.ticketNumber),
					drawDate: raffle.endDate,
					ticketPrice: raffle.ticketPrice,
					raffleImage: raffle.cover,
				}),
				to: user.email,
			});
		} catch (error) {
			this.logger.error(error);
		}
	}
}
