export type TicketAttributes = {
	id: string;
	ticketNumber: string;
	userId: string;
	raffleId: string;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
};

export class Ticket {
	public readonly id: string;
	public readonly ticketNumber: string;
	public readonly userId: string;
	public readonly raffleId: string;
	public readonly createdAt: Date;
	public readonly updatedAt: Date;
	public readonly deletedAt: Date | null;

	private constructor(data: TicketAttributes) {
		this.id = data.id;
		this.ticketNumber = data.ticketNumber;
		this.userId = data.userId;
		this.raffleId = data.raffleId;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;
		this.deletedAt = data.deletedAt;
	}

	static create(data: Omit<TicketAttributes, "createdAt" | "updatedAt" | "deletedAt">): Ticket {
		const createdAt = new Date();
		const updatedAt = new Date();

		return new Ticket({ ...data, createdAt, updatedAt, deletedAt: null });
	}

	static from(data: TicketAttributes): Ticket {
		return new Ticket(data);
	}
}
