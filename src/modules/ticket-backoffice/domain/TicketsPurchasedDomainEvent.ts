export type TicketsPurchasedPayload = {
	ticketIds: string[];
	userId: string;
};

export class TicketsPurchasedDomainEvent {
	static readonly DOMAIN_EVENT = "tickets.purchased";
	readonly data: TicketsPurchasedPayload;

	constructor(data: TicketsPurchasedPayload) {
		this.data = data;
	}
}
