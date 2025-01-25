export type TicketsPurchasedPayload = {
	ticketIds: string[];
	userId: string;
	raffleTitle: string;
	ticketsNumbers: string[];
	ticketPrice: number;
	paymentAmount: number;
	paymentMethod: string;
	paymentReference: string;
	paymentDate: Date;
	email?: string;
	dni?: string;
	phone?: string;
};

export class TicketsPurchasedDomainEvent {
	static readonly DOMAIN_EVENT = "tickets.purchased";
	readonly data: TicketsPurchasedPayload;

	constructor(data: TicketsPurchasedPayload) {
		this.data = data;
	}
}
