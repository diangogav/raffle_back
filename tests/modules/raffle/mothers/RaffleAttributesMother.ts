import { faker } from "@faker-js/faker";

import { RaffleAttributes } from "../../../../src/modules/raffle/domain/Raffle";

export class RaffleAttributesMother {
	static create(params?: Partial<RaffleAttributes>): RaffleAttributes {
		return {
			id: faker.string.uuid(),
			title: faker.lorem.words(),
			description: faker.lorem.paragraphs(),
			ticketPrice: faker.number.float({ min: 1 }),
			endDate: faker.date.future(),
			createdAt: faker.date.past(),
			updatedAt: faker.date.past(),
			totalTickets: faker.number.int({ min: 1 }),
			userId: faker.string.uuid(),
			...params,
		};
	}
}
