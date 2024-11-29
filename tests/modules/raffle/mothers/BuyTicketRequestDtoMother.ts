import { faker } from "@faker-js/faker";

import { BuyTicketRequestDto } from "../../../../src/modules/raffle/application/dtos/BuyTicketRequestDto";

export class BuyTicketRequestDtoMother {
	static create(params?: Partial<BuyTicketRequestDto>): BuyTicketRequestDto {
		return {
			ticketNumbers: [faker.number.int()],
			raffleId: faker.string.uuid(),
			userId: faker.string.uuid(),
			...params,
		};
	}
}
