import { faker } from "@faker-js/faker";

export class RaffleDetailFinderRequestDto {
	static create(params?: { raffleId: string }): { raffleId: string } {
		return {
			raffleId: faker.string.uuid(),
			...params,
		};
	}
}
