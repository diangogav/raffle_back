export type RaffleDrawnPayload = {
	raffleId: string;
	raffleTitle: string;
	raffleCover: string;
	rafflePrice: number;
	winnerTickets: string[];
	drawnAt: Date;
	totalTickets: number;
};

export class RaffleDrawnDomainEvent {
	static readonly DOMAIN_EVENT = "raffle.drawn";
	readonly data: RaffleDrawnPayload;

	constructor(data: RaffleDrawnPayload) {
		this.data = data;
	}
}
