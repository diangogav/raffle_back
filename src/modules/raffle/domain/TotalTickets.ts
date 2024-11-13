export class TotalTickets {
	public readonly value: number;

	constructor(value: number) {
		this.ensureIsAValidCount(value);
		this.value = value;
	}

	private ensureIsAValidCount(count: number) {
		if (count <= 0) {
			throw new Error("Total count should be greater than 0");
		}
	}
}
