import { Payment } from "src/modules/payment/domain/Payment";

import { TicketBackOffice } from "./TicketBackOffice";

export interface TicketBackOfficeRepository {
	get({ userId }: { userId: string }): Promise<TicketBackOffice[]>;
	getTicketPayment({ ticketId }: { ticketId: string }): Promise<Payment | null>;
	update(payment: Payment): Promise<void>;
}
