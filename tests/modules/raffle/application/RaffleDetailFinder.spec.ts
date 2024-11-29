import { beforeEach, describe, expect, it } from "bun:test";
import { mock, MockProxy } from "jest-mock-extended";

import { RaffleDetailFinder } from "../../../../src/modules/raffle/application/RaffleDetailFinder";
import { Raffle } from "../../../../src/modules/raffle/domain/Raffle";
import { RaffleRepository } from "../../../../src/modules/raffle/domain/RaffleRepository";
import { NotFoundError } from "../../../../src/shared/errors";
import { RaffleDetailFinderRequestDto } from "../mothers/RaffleDetailFinderRequestDtoMother";
import { RaffleMother } from "../mothers/RaffleMother";

describe("RaffleDetailFinder", () => {
	let request: { raffleId: string };
	let useCase: RaffleDetailFinder;
	let repository: MockProxy<RaffleRepository>;
	let raffle: Raffle;

	beforeEach(() => {
		request = RaffleDetailFinderRequestDto.create();
		repository = mock();
		useCase = new RaffleDetailFinder(repository);
		raffle = RaffleMother.create();
	});

	it("Should find a raffle by id", async () => {
		repository.findById.mockResolvedValue(raffle);
		const response = await useCase.get(request);
		expect(response).toEqual(raffle.detailPresentation());
		expect(repository.findById).toBeCalledTimes(1);
		expect(repository.findById).toBeCalledWith(request.raffleId);
	});

	it("Should throw a NotFoundError if raffle not found", async () => {
		repository.findById.mockResolvedValue(null);
		expect(useCase.get(request)).rejects.toThrow(new NotFoundError("Raffle not found"));
	});
});
