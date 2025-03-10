import { faker } from "@faker-js/faker";

import { RaffleAttributes } from "../../../../src/modules/raffle/domain/Raffle";
import { RaffleStatus } from "../../../../src/modules/raffle/domain/RaffleStatus.enum";

import { TicketMother } from "./TicketMother";

export class RaffleAttributesMother {
	static create(params?: Partial<RaffleAttributes>): RaffleAttributes {
		const id = faker.string.uuid();

		return {
			id,
			title: faker.lorem.words(),
			description: faker.lorem.paragraphs(),
			ticketPrice: faker.number.float({ min: 1 }),
			endDate: faker.date.future(),
			totalTickets: faker.number.int({ min: 1 }),
			userId: faker.string.uuid(),
			cover: faker.image.url(),
			status: faker.helpers.enumValue(RaffleStatus),
			tickets: [TicketMother.create({ raffleId: id })],
			winningTickets: [],
			drawnAt: faker.date.past(),
			...params,
		};
	}

	static noClosedAndNoSortable(): RaffleAttributes {
		return RaffleAttributesMother.create({
			status: RaffleAttributesMother.getRandomRaffleStatusExcludingClosedAndSortable(),
		});
	}

	static getRandomRaffleStatusExcludingClosedAndSortable(): RaffleStatus {
		const statuses = Object.values(RaffleStatus).filter(
			(status) => status !== RaffleStatus.CLOSED && status !== RaffleStatus.SORTABLE,
		);

		const randomIndex = Math.floor(Math.random() * statuses.length);

		return statuses[randomIndex];
	}
}
