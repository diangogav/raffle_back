import { faker } from "@faker-js/faker";

import { Ticket, TicketAttributes } from "../../../../src/modules/raffle/tickets/domain/Ticket";

export class TicketMother {
	static create(params?: Partial<TicketAttributes>): Ticket {
		return Ticket.from({
			id: faker.string.uuid(),
			ticketNumber: faker.number.int({ min: 1 }).toString(),
			userId: faker.string.uuid(),
			raffleId: faker.string.uuid(),
			createdAt: faker.date.past(),
			updatedAt: faker.date.past(),
			deletedAt: null,
			...params,
		});
	}
}
