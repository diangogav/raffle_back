import { DateTime } from "luxon";

export class ZonedDate {
	public readonly value: Date;
	constructor(
		private readonly date: Date,
		private readonly timezone: string,
	) {
		const dateTime = DateTime.fromJSDate(date).setZone(timezone);
		this.value = dateTime.toJSDate();
	}
}
