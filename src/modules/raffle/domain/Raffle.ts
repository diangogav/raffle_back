import { TicketPrice } from "./TicketPrice";
import { TotalTickets } from "./TotalTickets";

export type RaffleAttributes = {
	id: string;
	title: string;
	description: string;
	ticketPrice: number;
	endDate: Date;
	totalTickets: number;
	userId: string;
	cover: string;
};

export type RaffleDateAttributes = {
	createdAt: Date;
	updatedAt: Date;
};

export class Raffle {
	public readonly id: string;
	public readonly title: string;
	public readonly description: string;
	public readonly ticketPrice: number;
	public readonly endDate: Date;
	public readonly createdAt: Date;
	public readonly updatedAt: Date;
	public readonly totalTickets: number;
	public readonly userId: string;
	public readonly cover: string;

	private constructor(data: RaffleAttributes & RaffleDateAttributes) {
		this.id = data.id;
		this.title = data.title;
		this.description = data.description;
		this.ticketPrice = new TicketPrice(data.ticketPrice).value;
		this.endDate = data.endDate;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;
		this.totalTickets = new TotalTickets(data.totalTickets).value;
		this.userId = data.userId;
		this.cover = data.cover;
	}

	static create(data: RaffleAttributes): Raffle {
		const createdAt = new Date();
		const updatedAt = new Date();

		return new Raffle({ ...data, createdAt, updatedAt });
	}

	static from(data: RaffleAttributes & RaffleDateAttributes): Raffle {
		return new Raffle(data);
	}
}
