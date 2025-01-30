export class ExchangeRate {
	constructor(
		public readonly date: string,
		public readonly from: string,
		public readonly to: string,
		public readonly price: number,
	) {}
}
