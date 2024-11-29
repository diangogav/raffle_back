import { randomUUID } from "crypto";

import { ConflictError, InvalidArgumentError } from "../../../shared/errors";
import { Ticket } from "../tickets/domain/Ticket";

import { RaffleStatus } from "./RaffleStatus.enum";
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
	status: RaffleStatus;
	tickets: Ticket[];
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
	private _status: RaffleStatus;
	private readonly tickets: Ticket[];

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
		this._status = data.status;
		this.tickets = data.tickets;
	}

	static create(data: Omit<RaffleAttributes, "status" | "tickets">): Raffle {
		const createdAt = new Date();
		const updatedAt = new Date();

		return new Raffle({ ...data, status: RaffleStatus.PENDING, createdAt, updatedAt, tickets: [] });
	}

	static from(data: RaffleAttributes & RaffleDateAttributes): Raffle {
		return new Raffle(data);
	}

	takeTicket(ticketNumber: number, userId: string): Ticket {
		this.IsValidTicket(ticketNumber);

		const id = randomUUID();
		const ticket = this.generateTicket(id, ticketNumber, userId);

		if (this.tickets.length === this.totalTickets) {
			this._status = RaffleStatus.CLOSED;
		}

		return ticket;
	}

	detailPresentation(): RaffleAttributes {
		return {
			id: this.id,
			title: this.title,
			description: this.description,
			ticketPrice: this.ticketPrice,
			endDate: this.endDate,
			totalTickets: this.totalTickets,
			userId: this.userId,
			cover: this.cover,
			status: this._status,
			tickets: this.tickets,
		};
	}

	private generateTicket(
		id: `${string}-${string}-${string}-${string}-${string}`,
		ticketNumber: number,
		userId: string,
	) {
		const ticket = Ticket.create({
			id,
			ticketNumber: ticketNumber.toString(),
			userId,
			raffleId: this.id,
		});

		this.tickets.push(ticket);

		return ticket;
	}

	private IsValidTicket(ticketNumber: number) {
		if (this._status !== RaffleStatus.ONGOING) {
			throw new Error(`Raffle with id ${this.id} not active.`);
		}
		const ticketTaken = this.tickets.find((ticket) => +ticket.ticketNumber === ticketNumber);
		if (ticketTaken) {
			throw new ConflictError(`Ticket ${ticketNumber} already taken.`);
		}

		if (!(ticketNumber >= 1 && ticketNumber <= this.totalTickets)) {
			throw new InvalidArgumentError(`Ticket ${ticketNumber} not valid`);
		}
	}

	get ticketsPurchased(): number[] {
		return this.tickets.map((ticket) => +ticket.ticketNumber);
	}

	get status(): RaffleStatus {
		return this._status;
	}
}
