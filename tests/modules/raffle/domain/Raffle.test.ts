import { beforeEach, describe, expect, it } from "bun:test";

import { Raffle, RaffleAttributes } from "../../../../src/modules/raffle/domain/Raffle";
import { RaffleStatus } from "../../../../src/modules/raffle/domain/RaffleStatus.enum";
import { RaffleAttributesMother } from "../mothers/RaffleAttributesMother";

describe("Raffle", () => {
	let params: RaffleAttributes;

	beforeEach(() => {
		params = RaffleAttributesMother.create();
	});

	it("Should instantiate a Raffle correctly", () => {
		const raffle = Raffle.create(params);
		expect(raffle.id).toBe(params.id);
		expect(raffle.title).toBe(params.title);
		expect(raffle.description).toBe(params.description);
		expect(raffle.ticketPrice).toBe(params.ticketPrice);
		expect(raffle.endDate).toBe(params.endDate);
		expect(raffle.totalTickets).toBe(params.totalTickets);
		expect(raffle.userId).toBe(params.userId);
		expect(raffle.status).toBe(RaffleStatus.PENDING);
		expect(raffle.drawnAt).toBe(null);
		expect(raffle.winningTickets).toEqual([]);
	});

	it("Should throw an Error if ticketPrice is lower or equal than 0", () => {
		params.ticketPrice = 0;

		expect(() => Raffle.create(params)).toThrow(new Error("Ticket price should be greater than 0"));

		params.ticketPrice = -1;

		expect(() => Raffle.create(params)).toThrow(new Error("Ticket price should be greater than 0"));
	});

	it("Should throw an Error if totalTickets is lower or equal than 0", () => {
		params.totalTickets = 0;

		expect(() => Raffle.create(params)).toThrow(new Error("Total count should be greater than 0"));

		params.totalTickets = -1;

		expect(() => Raffle.create(params)).toThrow(new Error("Total count should be greater than 0"));
	});

	it("Should throw an error if try to select winner in a no CLOSED raffle", () => {
		params = RaffleAttributesMother.noClosedAndNoSortable();
		const raffle = Raffle.from({
			...params,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		expect(() => raffle.draw()).toThrow(
			new Error(
				`Raffle with id ${raffle.id} is not closed and is not sortable. Only closed or sortable raffles can have a winner.`,
			),
		);
	});

	it("Should throw an error if try select winner and not have tickets sold", () => {
		params.tickets = [];
		params.status = RaffleStatus.CLOSED;
		const raffle = Raffle.from({
			...params,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		expect(() => raffle.draw()).toThrow(new Error(`No tickets sold for this raffle.`));
	});

	it("Should select winner correctly if status is CLOSED", () => {
		params.status = RaffleStatus.CLOSED;
		const raffle = Raffle.from({
			...params,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		const winnerTicket = raffle.draw();

		expect(winnerTicket).toEqual(params.tickets[0]);
	});

	it("Should select winner correctly if status is SORTABLE", () => {
		params.status = RaffleStatus.SORTABLE;
		const raffle = Raffle.from({
			...params,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		const winnerTicket = raffle.draw();

		expect(winnerTicket).toEqual(params.tickets[0]);
	});
});
