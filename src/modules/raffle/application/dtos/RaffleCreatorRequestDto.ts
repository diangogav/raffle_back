export type RaffleCreatorRequestDto = {
	id: string;
	title: string;
	description: string;
	ticketPrice: number;
	endDate: Date;
	totalTickets: number;
	userId: string;
	cover: string;
};
