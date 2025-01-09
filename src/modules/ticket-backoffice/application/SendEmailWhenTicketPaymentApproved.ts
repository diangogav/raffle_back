import { EmailSender } from "../../../shared/email/domain/EmailSender";
import { PaymentApprovedTemplate } from "../../../shared/email/domain/PaymentApprovedTemplate";
import { DomainEventSubscriber } from "../../../shared/event-bus/infrastructure/InMemoryEventBus";
import { Logger } from "../../../shared/logger/domain/Logger";
import { UserFinderDomainService } from "../../../shared/user/domain/UserFinderDomainService";
import { TicketPaymentApprovedDomainEvent } from "../domain/TicketPaymentApprovedDomainEvent";

export class SendEmailWhenTicketPaymentApproved implements DomainEventSubscriber<TicketPaymentApprovedDomainEvent> {
	static readonly ListenTo = TicketPaymentApprovedDomainEvent.DOMAIN_EVENT;

	constructor(
		private readonly logger: Logger,
		private readonly userFinderDomainService: UserFinderDomainService,
		private readonly emailSender: EmailSender,
	) {}

	async handle(event: TicketPaymentApprovedDomainEvent): Promise<void> {
		try {
			this.logger.info(JSON.stringify(event));

			const user = await this.userFinderDomainService.find({ userId: event.data.userId });

			await this.emailSender.send({
				template: new PaymentApprovedTemplate(user.name),
				to: user.email,
			});
		} catch (error) {
			this.logger.error(error);
		}
	}
}
