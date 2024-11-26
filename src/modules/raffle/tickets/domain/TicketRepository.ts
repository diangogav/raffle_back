import { Ticket } from "./Ticket";

export interface TicketRepository {
	getByRaffleId(raffleId: string): Promise<Ticket[]>;
}
