import { EmailSender } from "src/shared/email/domain/EmailSender";
import { ConflictError, NotFoundError } from "src/shared/errors";

import { TicketBackOfficeRepository } from "../domain/TicketBackOfficeRepository";

import { PaymentApprovedTemplate } from "../../../shared/email/domain/PaymentApprovedTemplate";
import { UserRepository } from "./../../user/domain/UserRepository";

export class ApproveTicketPayment {
	constructor(
		private readonly repository: TicketBackOfficeRepository,
		private readonly userRepository: UserRepository,
		private readonly email: EmailSender,
	) {}

	async approve({ ticketId }: { ticketId: string }): Promise<void> {
		const payment = await this.repository.getTicketPayment({ ticketId });

		if (!payment) {
			throw new NotFoundError(`Payment for ticket ${ticketId} not found`);
		}

		payment.approve();

		await this.repository.update(payment);

		const user = await this.userRepository.findById(payment.userId);

		if (!user) {
			throw new ConflictError(`User for payment in ticket ${ticketId} not found`);
		}

		await this.email.send({
			template: new PaymentApprovedTemplate(user.name),
			to: user.email,
		});
	}
}
