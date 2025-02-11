import { Ticket } from "../tickets/domain/Ticket";

import { Raffle } from "./Raffle";
import { RaffleStatus } from "./RaffleStatus.enum";

export interface RaffleRepository {
	save(raffle: Raffle): Promise<void>;
	getRafflesSortedBy({
		field,
		direction,
		limit,
		page,
		statuses,
	}: {
		field: string;
		direction: "ASC" | "DESC";
		limit: number;
		page: number;
		statuses: RaffleStatus[];
	}): Promise<Raffle[]>;
	getTickets(raffleId: string): Promise<Ticket[]>;
	getTicketsByPaymentId(paymentId: string): Promise<Ticket[]>;
	findById(raffleId: string): Promise<Raffle | null>;
	saveTicket(ticket: Ticket): Promise<void>;
	rafflesWithTickets(userId: string, statuses: RaffleStatus[]): Promise<Raffle[]>;
	getRafflesByStatusAndEndDateGreaterThan(
		status: RaffleStatus,
		date: Date,
		limit: number,
		page: number,
	): Promise<Raffle[]>;
	getTicketsByIds(ticketsIds: string[]): Promise<Ticket[]>;
}
