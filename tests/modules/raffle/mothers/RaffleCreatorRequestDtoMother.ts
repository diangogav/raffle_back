import { faker } from "@faker-js/faker";

import { RaffleCreatorRequestDto } from "../../../../src/modules/raffle/application/dtos/RaffleCreatorRequestDto";

export class RaffleCreatorRequestDtoMother {
	static create(params?: Partial<RaffleCreatorRequestDto>): RaffleCreatorRequestDto {
		return {
			id: faker.string.uuid(),
			title: faker.lorem.words(),
			description: faker.lorem.paragraphs(),
			ticketPrice: faker.number.float({ min: 1 }),
			endDate: faker.date.future(),
			totalTickets: faker.number.int({ min: 1 }),
			userId: faker.string.uuid(),
			...params,
		};
	}
}
