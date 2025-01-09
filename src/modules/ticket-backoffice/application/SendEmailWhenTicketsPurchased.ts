import { EmailSender } from "../../../shared/email/domain/EmailSender";
import { PaymentInProcessTemplate } from "../../../shared/email/domain/PaymentInProcessTemplate";
import { DomainEventSubscriber } from "../../../shared/event-bus/infrastructure/InMemoryEventBus";
import { Logger } from "../../../shared/logger/domain/Logger";
import { UserFinderDomainService } from "../../../shared/user/domain/UserFinderDomainService";
import { TicketsPurchasedDomainEvent } from "../domain/TicketsPurchasedDomainEvent";

export class SendEmailWhenTicketsPurchased implements DomainEventSubscriber<TicketsPurchasedDomainEvent> {
	static readonly ListenTo = TicketsPurchasedDomainEvent.DOMAIN_EVENT;

	constructor(
		private readonly logger: Logger,
		private readonly userFinderDomainService: UserFinderDomainService,
		private readonly emailSender: EmailSender,
	) {}

	async handle(event: TicketsPurchasedDomainEvent): Promise<void> {
		try {
			this.logger.info(JSON.stringify(event));

			const user = await this.userFinderDomainService.find({ userId: event.data.userId });

			await this.emailSender.send({
				template: new PaymentInProcessTemplate(user.name),
				to: user.email,
			});
		} catch (error) {
			this.logger.error(error);
		}
	}
}
