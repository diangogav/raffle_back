import { ConflictError } from "../../../shared/errors";
import { PaymentFactory } from "../../payment/domain/PaymentFactory";
import { PaymentRepository } from "../../payment/domain/PaymentRepository";
import { RaffleRepository } from "../domain/RaffleRepository";

import { BuyTicketRequestDto } from "./dtos/BuyTicketRequestDto";

export class BuyTicket {
	constructor(
		private readonly repository: RaffleRepository,
		private readonly paymentRepository: PaymentRepository,
	) {}

	async buy(data: BuyTicketRequestDto): Promise<void> {
		const raffle = await this.repository.findById(data.raffleId);

		if (!raffle) {
			throw new ConflictError(`Raffle with id ${data.raffleId} not found`);
		}

		this.ensurePaymentAmountIsValid({
			ticketNumbers: data.ticketNumbers,
			ticketPrice: raffle.ticketPrice,
			paymentAmount: data.paymentAmount,
		});

		const payment = PaymentFactory.create({
			id: data.paymentId,
			reference: data.reference,
			amount: data.paymentAmount,
			paymentMethod: data.paymentMethod,
			name: data.name,
			dni: data.dni,
			phone: data.phone,
			email: data.email,
			userId: data.userId,
		});

		const tickets = data.ticketNumbers.map((ticketNumber) =>
			raffle.takeTicket(ticketNumber, data.userId, payment.id),
		);

		await this.paymentRepository.save(payment);

		await Promise.allSettled(tickets.map((ticket) => this.repository.saveTicket(ticket)));

		await this.repository.save(raffle);
	}

	private ensurePaymentAmountIsValid({
		ticketNumbers,
		ticketPrice,
		paymentAmount,
	}: {
		ticketNumbers: number[];
		ticketPrice: number;
		paymentAmount: number;
	}): void {
		if (paymentAmount < ticketNumbers.length * ticketPrice) {
			throw new ConflictError(`Insufficient amount.`);
		}
	}
}
