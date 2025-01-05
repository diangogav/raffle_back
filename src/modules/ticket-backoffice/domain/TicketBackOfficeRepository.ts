import { TicketBackOffice } from "./TicketBackOffice";

export interface TicketBackOfficeRepository {
	get({ userId }): Promise<TicketBackOffice[]>;
}
