import { faker } from "@faker-js/faker";

import { PaymentMethod } from "../../../../src/modules/payment/domain/PaymentMethod.enum";
import { BuyTicketRequestDto } from "../../../../src/modules/raffle/application/dtos/BuyTicketRequestDto";

export class BuyTicketRequestDtoMother {
	static create(params?: Partial<BuyTicketRequestDto>): BuyTicketRequestDto {
		const ticketPrice = +faker.finance.amount();
		const paymentAmount = ticketPrice;

		return {
			paymentId: faker.string.uuid(),
			userId: faker.string.uuid(),
			ticketNumbers: [faker.number.int()],
			ticketPrice,
			raffleId: faker.string.uuid(),
			reference: faker.finance.iban(),
			name: faker.person.fullName(),
			dni: faker.string.alphanumeric(),
			phone: faker.phone.number(),
			paymentAmount,
			email: faker.internet.email(),
			paymentMethod: faker.helpers.enumValue(PaymentMethod),
			...params,
		};
	}
}
