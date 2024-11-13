export class TicketPrice {
	public readonly value: number;

	constructor(value: number) {
		this.ensureIsAValidAmount(value);
		this.value = value;
	}

	private ensureIsAValidAmount(amount: number) {
		if (amount <= 0) {
			throw new Error("Ticket price should be greater than 0");
		}
	}
}
