import { UserRepository } from "src/modules/user/domain/UserRepository";
import { EmailSender } from "src/shared/email/domain/EmailSender";

import { ConflictError, NotFoundError } from "../../../shared/errors";
import { TicketBackOfficeRepository } from "../domain/TicketBackOfficeRepository";

import { PaymentDeniedTemplate } from "./../../../shared/email/domain/PaymentDeniedTemplate";

export class DenyTicketPayment {
	constructor(
		private readonly repository: TicketBackOfficeRepository,
		private readonly userRepository: UserRepository,
		private readonly email: EmailSender,
	) {}

	async deny({ ticketId }: { ticketId: string }): Promise<void> {
		const payment = await this.repository.getTicketPayment({ ticketId });

		if (!payment) {
			throw new NotFoundError(`Payment for ticket ${ticketId} not found`);
		}

		payment.deny();

		await this.repository.update(payment);
		await this.repository.deleteTicket({ ticketId });

		const user = await this.userRepository.findById(payment.userId);

		if (!user) {
			throw new ConflictError(`User for payment in ticket ${ticketId} not found`);
		}

		await this.email.send({
			template: new PaymentDeniedTemplate(user.name),
			to: user.email,
		});
	}
}
