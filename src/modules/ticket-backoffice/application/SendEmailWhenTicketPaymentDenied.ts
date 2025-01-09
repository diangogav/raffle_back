import { EmailSender } from "../../../shared/email/domain/EmailSender";
import { PaymentDeniedTemplate } from "../../../shared/email/domain/PaymentDeniedTemplate";
import { DomainEventSubscriber } from "../../../shared/event-bus/infrastructure/InMemoryEventBus";
import { Logger } from "../../../shared/logger/domain/Logger";
import { UserFinderDomainService } from "../../../shared/user/domain/UserFinderDomainService";
import { TicketPaymentDeniedDomainEvent } from "../domain/TicketPaymentDeniedDomainEvent";

export class SendEmailWhenTicketPaymentDenied implements DomainEventSubscriber<TicketPaymentDeniedDomainEvent> {
	static readonly ListenTo = TicketPaymentDeniedDomainEvent.DOMAIN_EVENT;

	constructor(
		private readonly logger: Logger,
		private readonly userFinderDomainService: UserFinderDomainService,
		private readonly emailSender: EmailSender,
	) {}

	async handle(event: TicketPaymentDeniedDomainEvent): Promise<void> {
		try {
			this.logger.info(JSON.stringify(event));

			const user = await this.userFinderDomainService.find({ userId: event.data.userId });

			await this.emailSender.send({
				template: new PaymentDeniedTemplate(user.name),
				to: user.email,
			});
		} catch (error) {
			this.logger.error(error);
		}
	}
}
