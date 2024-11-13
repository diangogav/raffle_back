import { beforeEach, describe, expect, it } from "bun:test";

import { Raffle, RaffleAttributes } from "../../../../src/modules/raffle/domain/Raffle";
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
});
