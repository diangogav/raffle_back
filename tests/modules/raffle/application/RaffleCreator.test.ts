import { beforeEach, describe, expect, it } from "bun:test";
import { mock, MockProxy } from "jest-mock-extended";
import { RaffleStatus } from "src/modules/raffle/domain/RaffleStatus.enum";

import { RaffleCreatorRequestDto } from "../../../../src/modules/raffle/application/dtos/RaffleCreatorRequestDto";
import { RaffleCreator } from "../../../../src/modules/raffle/application/RaffleCreator";
import { Raffle } from "../../../../src/modules/raffle/domain/Raffle";
import { RaffleRepository } from "../../../../src/modules/raffle/domain/RaffleRepository";
import { Logger } from "../../../../src/shared/logger/domain/Logger";
import { RaffleCreatorRequestDtoMother } from "../mothers/RaffleCreatorRequestDtoMother";

describe("RaffleCreator", () => {
	let request: RaffleCreatorRequestDto;
	let useCase: RaffleCreator;
	let repository: MockProxy<RaffleRepository>;
	let logger: MockProxy<Logger>;

	beforeEach(() => {
		request = RaffleCreatorRequestDtoMother.create();
		logger = mock();
		repository = mock();
		useCase = new RaffleCreator(repository, logger);
	});

	it("Should execute RaffleCreator correctly", async () => {
		await useCase.create(request);
		expect(repository.save).toHaveBeenCalledTimes(1);
		const raffle = Raffle.create(request);
		expect(raffle.status).toBe(RaffleStatus.PENDING);
		expect(raffle.drawnAt).toBe(null);
		expect(raffle.winningTickets).toEqual([]);
	});
});
