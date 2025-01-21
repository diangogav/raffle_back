type WinnerTicket = {
	readonly ticketId: string;
	readonly ticketNumber: string;
};

export class RaffleWinners {
	public readonly title: string;
	public readonly cover: string;
	public readonly winnerTickets: WinnerTicket[];
}
