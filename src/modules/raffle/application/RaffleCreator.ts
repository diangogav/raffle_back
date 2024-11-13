import { Logger } from "../../../shared/logger/domain/Logger";
import { Raffle } from "../domain/Raffle";
import { RaffleRepository } from "../domain/RaffleRepository";

import { RaffleCreatorRequestDto } from "./dtos/RaffleCreatorRequestDto";

export class RaffleCreator {
	constructor(
		private readonly raffleRepository: RaffleRepository,
		private readonly logger: Logger,
	) {}

	async create(payload: RaffleCreatorRequestDto): Promise<void> {
		this.logger.info(`Creating a raffle with id ${payload.id} for userId: ${payload.userId}`);

		const raffle = Raffle.create(payload);

		await this.raffleRepository.save(raffle);
	}
}
