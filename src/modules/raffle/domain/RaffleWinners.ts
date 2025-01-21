type WinnerTicket = {
	readonly ticketId: string;
	readonly ticketNumber: string;
};

export class RaffleWinners {
	public readonly title: string;
	public readonly cover: string;
	public readonly drawnAt: Date | null;
	public readonly endDate: Date;
	public readonly winnerTickets: WinnerTicket[];
}
