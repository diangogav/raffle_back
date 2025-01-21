export type RaffleDrawnPayload = {
	raffleId: string;
	raffleTitle: string;
	raffleCover: string;
	winnerTickets: string[];
	drawnAt: Date;
};

export class RaffleDrawnDomainEvent {
	static readonly DOMAIN_EVENT = "raffle.drawn";
	readonly data: RaffleDrawnPayload;

	constructor(data: RaffleDrawnPayload) {
		this.data = data;
	}
}
