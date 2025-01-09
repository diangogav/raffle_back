export type TicketPaymentDeniedPayload = {
	ticketId: string;
	userId: string;
};

export class TicketPaymentDeniedDomainEvent {
	static readonly DOMAIN_EVENT = "ticket.payment.denied";
	readonly data: TicketPaymentDeniedPayload;

	constructor(data: TicketPaymentDeniedPayload) {
		this.data = data;
	}
}
