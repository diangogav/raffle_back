import { faker } from "@faker-js/faker";

import { Raffle, RaffleAttributes, RaffleDateAttributes } from "../../../../src/modules/raffle/domain/Raffle";

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
}
