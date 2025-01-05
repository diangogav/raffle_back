import { TicketBackOfficeAttributes } from "../domain/TicketBackOffice";
import { TicketBackOfficeRepository } from "../domain/TicketBackOfficeRepository";

export class TicketBackOfficeGetter {
	constructor(private readonly repository: TicketBackOfficeRepository) {}

	async get({ userId }: { userId: string }): Promise<TicketBackOfficeAttributes[]> {
		const tickets = await this.repository.get({ userId });

		return tickets.map((ticket) => ticket.toPresentation());
	}
}
