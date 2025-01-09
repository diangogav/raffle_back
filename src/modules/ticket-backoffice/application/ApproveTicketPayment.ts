import { NotFoundError } from "src/shared/errors";

import { EventBus } from "../../../shared/event-bus/domain/EventBus";
import { TicketBackOfficeRepository } from "../domain/TicketBackOfficeRepository";
import { TicketPaymentApprovedDomainEvent } from "../domain/TicketPaymentApprovedDomainEvent";

export class ApproveTicketPayment {
	constructor(
		private readonly repository: TicketBackOfficeRepository,
		private readonly eventBus: EventBus,
	) {}

	async approve({ ticketId }: { ticketId: string }): Promise<void> {
		const payment = await this.repository.getTicketPayment({ ticketId });

		if (!payment) {
			throw new NotFoundError(`Payment for ticket ${ticketId} not found`);
		}

		payment.approve();

		await this.repository.update(payment);

		this.eventBus.publish(
			TicketPaymentApprovedDomainEvent.DOMAIN_EVENT,
			new TicketPaymentApprovedDomainEvent({ ticketId, userId: payment.userId }),
		);
	}
}
