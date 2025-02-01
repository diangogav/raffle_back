import { DateTime } from "luxon";

export class TimeZoneDateTime {
	public readonly value: string;
	constructor(
		private readonly date: Date,
		private readonly timezone: string,
	) {
		const dateInUTC = DateTime.fromISO("2025-02-14T00:00:00", { zone: "utc" });
		const dateInTargetZone = dateInUTC.setZone(timezone);
		const isoDateInTargetZone = dateInTargetZone.toISO();

		if (!isoDateInTargetZone) {
			throw new Error("Invalid date");
		}

		this.value = isoDateInTargetZone;
	}
}
