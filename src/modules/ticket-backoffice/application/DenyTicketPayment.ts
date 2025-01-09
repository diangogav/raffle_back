import { NotFoundError } from "../../../shared/errors";
import { EventBus } from "../../../shared/event-bus/domain/EventBus";
import { TicketBackOfficeRepository } from "../domain/TicketBackOfficeRepository";
import { TicketPaymentDeniedDomainEvent } from "../domain/TicketPaymentDeniedDomainEvent";

export class DenyTicketPayment {
	constructor(
		private readonly repository: TicketBackOfficeRepository,
		private readonly eventBus: EventBus,
	) {}

	async deny({ ticketId }: { ticketId: string }): Promise<void> {
		const payment = await this.repository.getTicketPayment({ ticketId });

		if (!payment) {
			throw new NotFoundError(`Payment for ticket ${ticketId} not found`);
		}

		payment.deny();

		await this.repository.update(payment);
		await this.repository.deleteTicket({ ticketId });

		this.eventBus.publish(
			TicketPaymentDeniedDomainEvent.DOMAIN_EVENT,
			new TicketPaymentDeniedDomainEvent({
				ticketId,
				userId: payment.userId,
			}),
		);
	}
}
