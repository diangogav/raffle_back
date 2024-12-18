import { ConflictError } from "../../../shared/errors";
import { PaymentFactory } from "../../payment/domain/PaymentFactory";
import { PaymentRepository } from "../../payment/domain/PaymentRepository";
import { Raffle } from "../domain/Raffle";
import { RaffleRepository } from "../domain/RaffleRepository";

import { ExchangeRateRepository } from "./../../../shared/exchange-rate/domain/ExchangeRateRepository";
import { PaymentMethod } from "./../../payment/domain/PaymentMethod.enum";
import { BuyTicketRequestDto } from "./dtos/BuyTicketRequestDto";

export class BuyTicket {
	constructor(
		private readonly repository: RaffleRepository,
		private readonly paymentRepository: PaymentRepository,
		private readonly exchangeRateRepository: ExchangeRateRepository,
	) {}

	async buy(data: BuyTicketRequestDto): Promise<void> {
		const raffle = await this.repository.findById(data.raffleId);

		if (!raffle) {
			throw new ConflictError(`Raffle with id ${data.raffleId} not found`);
		}

		await this.ensurePaymentAmountIsValid({
			ticketNumbers: data.ticketNumbers,
			paymentAmount: data.paymentAmount,
			paymentMethod: data.paymentMethod,
			raffle,
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

	private async ensurePaymentAmountIsValid({
		ticketNumbers,
		paymentAmount,
		paymentMethod,
		raffle,
	}: {
		ticketNumbers: number[];
		paymentAmount: number;
		paymentMethod: PaymentMethod;
		raffle: Raffle;
	}): Promise<void> {
		if (paymentMethod === PaymentMethod.BINANCE) {
			if (paymentAmount < ticketNumbers.length * raffle.ticketPrice) {
				throw new ConflictError(`Insufficient amount.`);
			}
		}

		if (paymentMethod === PaymentMethod.PAGO_MOVIL) {
			const exchangeRate = await this.exchangeRateRepository.dollarToBCVRate();
			const totalPrice = ticketNumbers.length * raffle.priceByExchangeRate(exchangeRate);

			if (paymentAmount < totalPrice) {
				throw new ConflictError(`Insufficient amount.`);
			}
		}
	}
}
