import { faker } from "@faker-js/faker";

import { Raffle, RaffleAttributes, RaffleDateAttributes } from "../../../../src/modules/raffle/domain/Raffle";
import { RaffleStatus } from "../../../../src/modules/raffle/domain/RaffleStatus.enum";

import { RaffleAttributesMother } from "./RaffleAttributesMother";

export class RaffleMother {
	static create(params?: Partial<RaffleAttributes & RaffleDateAttributes>): Raffle {
		return Raffle.from({
			createdAt: faker.date.past(),
			updatedAt: faker.date.past(),
			...RaffleAttributesMother.create(),
			...params,
		});
	}

	static notOngoing(params?: Partial<RaffleAttributes & RaffleDateAttributes>): Raffle {
		return RaffleMother.create({
			...params,
			status: faker.helpers.arrayElement([
				RaffleStatus.PENDING,
				RaffleStatus.CLOSED,
				RaffleStatus.DRAWN,
				RaffleStatus.WINNER_CONFIRMED,
				RaffleStatus.CANCELED,
			]),
		});
	}
}
