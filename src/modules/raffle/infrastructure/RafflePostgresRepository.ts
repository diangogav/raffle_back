import { dataSource } from "../../../shared/database/infrastructure/postgres/data-source";
import { RaffleEntity } from "../../../shared/database/infrastructure/postgres/entities/RaffleEntity";
import { TicketEntity } from "../../../shared/database/infrastructure/postgres/entities/TicketEntity";
import { Raffle } from "../domain/Raffle";
import { RaffleRepository } from "../domain/RaffleRepository";
import { RaffleStatus } from "../domain/RaffleStatus.enum";
import { Ticket } from "../tickets/domain/Ticket";

export class RafflePostgresRepository implements RaffleRepository {
	async save(raffle: Raffle): Promise<void> {
		const repository = dataSource.getRepository(RaffleEntity);
		const raffleEntity = repository.create({
			id: raffle.id,
			title: raffle.title,
			description: raffle.description,
			ticketPrice: raffle.ticketPrice,
			endDate: raffle.endDate,
			totalTickets: raffle.totalTickets,
			userId: raffle.userId,
			cover: raffle.cover,
		});
		await repository.save(raffleEntity);
	}

	async getOngoingRafflesSortedBy({
		field,
		direction,
		limit,
		page,
	}: {
		field: string;
		direction: "ASC" | "DESC";
		limit: number;
		page: number;
	}): Promise<Raffle[]> {
		const repository = dataSource.getRepository(RaffleEntity);

		const raffles = await repository.find({
			where: {
				status: RaffleStatus.ONGOING,
			},
			order: {
				[field]: direction,
			},
			take: limit,
			skip: (page - 1) * limit,
		});

		return raffles.map((raffleEntity) => {
			return Raffle.from({
				id: raffleEntity.id,
				title: raffleEntity.title,
				description: raffleEntity.description,
				ticketPrice: raffleEntity.ticketPrice,
				endDate: raffleEntity.endDate,
				totalTickets: raffleEntity.totalTickets,
				userId: raffleEntity.userId,
				cover: raffleEntity.cover,
				createdAt: raffleEntity.createdAt,
				updatedAt: raffleEntity.updatedAt,
				status: raffleEntity.status,
				tickets: [],
			});
		});
	}

	async getTickets(raffleId: string): Promise<Ticket[]> {
		const repository = dataSource.getRepository(TicketEntity);

		const tickets = await repository.find({
			where: {
				raffleId,
			},
		});

		return tickets.map((ticket) => Ticket.from(ticket));
	}

	async findById(raffleId: string): Promise<Raffle | null> {
		const repository = dataSource.getRepository(RaffleEntity);
		const raffleEntity = await repository.findOne({ where: { id: raffleId } });
		if (!raffleEntity) {
			return null;
		}

		const tickets = await this.getTickets(raffleId);

		return Raffle.from({ ...raffleEntity, tickets });
	}

	async saveTicket(ticket: Ticket): Promise<void> {
		const repository = dataSource.getRepository(TicketEntity);
		const ticketEntity = repository.create({
			id: ticket.id,
			ticketNumber: ticket.ticketNumber,
			userId: ticket.userId,
			raffleId: ticket.raffleId,
		});
		await repository.save(ticketEntity);
	}
}
