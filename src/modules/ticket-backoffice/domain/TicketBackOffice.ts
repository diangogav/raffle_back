export type TicketBackOfficeAttributes = {
	id: string;
	ticketNumber: string;
	userId: string;
	raffleId: string;
	raffleTitle: string;
	raffleEndDate: Date;
	paymentReference: string;
	verified: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
	paymentId?: string | null;
};

export class TicketBackOffice {
	public readonly id: string;
	public readonly ticketNumber: string;
	public readonly userId: string;
	public readonly raffleId: string;
	public readonly raffleTitle: string;
	public readonly paymentReference: string;
	public readonly verified: boolean;
	public readonly createdAt: Date;
	public readonly updatedAt: Date;
	public readonly deletedAt: Date | null;
	public readonly paymentId?: string | null;
	public readonly raffleEndDate: Date;

	private constructor(data: TicketBackOfficeAttributes) {
		this.id = data.id;
		this.ticketNumber = data.ticketNumber;
		this.userId = data.userId;
		this.raffleId = data.raffleId;
		this.raffleTitle = data.raffleTitle;
		this.paymentReference = data.paymentReference;
		this.verified = data.verified;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;
		this.deletedAt = data.deletedAt;
		this.paymentId = data.paymentId;
		this.raffleEndDate = data.raffleEndDate;
	}

	static create(data: Omit<TicketBackOfficeAttributes, "createdAt" | "updatedAt" | "deletedAt">): TicketBackOffice {
		const createdAt = new Date();
		const updatedAt = new Date();

		return new TicketBackOffice({
			...data,
			createdAt,
			updatedAt,
			deletedAt: null,
		});
	}

	static from(data: TicketBackOfficeAttributes): TicketBackOffice {
		return new TicketBackOffice(data);
	}

	toPresentation(): TicketBackOfficeAttributes {
		return {
			id: this.id,
			ticketNumber: this.ticketNumber,
			userId: this.userId,
			raffleId: this.raffleId,
			raffleTitle: this.raffleTitle,
			paymentReference: this.paymentReference,
			verified: this.verified,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			deletedAt: this.deletedAt,
			paymentId: this.paymentId,
			raffleEndDate: this.raffleEndDate,
		};
	}
}
