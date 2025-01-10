export type TicketPaymentApprovedPayload = {
	paymentId: string;
	userId: string;
};

export class TicketPaymentApprovedDomainEvent {
	static readonly DOMAIN_EVENT = "ticket.payment.approved";
	readonly data: TicketPaymentApprovedPayload;

	constructor(data: TicketPaymentApprovedPayload) {
		this.data = data;
	}
}
