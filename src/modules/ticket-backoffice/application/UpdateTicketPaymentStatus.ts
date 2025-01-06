import { PaymentStatus } from "src/modules/payment/domain/PaymentStatus";
import { NotFoundError } from "src/shared/errors";

import { TicketBackOfficeRepository } from "../domain/TicketBackOfficeRepository";

export class UpdateTicketPaymentStatus {
	constructor(private readonly repository: TicketBackOfficeRepository) {}

	async changeStatus({ ticketId, status }: { ticketId: string; status: PaymentStatus }): Promise<void> {
		const payment = await this.repository.getTicketPayment({ ticketId });

		if (!payment) {
			throw new NotFoundError(`Payment for ticket ${ticketId} not found`);
		}

		payment.changeStatus(status);

		await this.repository.update(payment);
	}
}
