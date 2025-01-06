import { faker } from "@faker-js/faker";

import { Payment, PaymentAttributes, PaymentDateAttributes } from "../../../../src/modules/payment/domain/Payment";
import { PaymentFactory } from "../../../../src/modules/payment/domain/PaymentFactory";
import { PaymentMethod } from "../../../../src/modules/payment/domain/PaymentMethod.enum";
import { PaymentStatus } from "../../../../src/modules/payment/domain/PaymentStatus";

export class PaymentMother {
	static create(params?: Partial<PaymentAttributes & PaymentDateAttributes>): Payment {
		return PaymentFactory.from({
			id: faker.string.uuid(),
			reference: faker.finance.accountNumber(),
			amount: +faker.finance.amount(),
			paymentMethod: faker.helpers.enumValue(PaymentMethod),
			name: faker.person.firstName(),
			dni: faker.string.alphanumeric(),
			phone: faker.phone.number(),
			email: faker.internet.email(),
			userId: faker.string.uuid(),
			status: faker.helpers.enumValue(PaymentStatus),
			createdAt: faker.date.past(),
			updatedAt: faker.date.past(),
			...params,
		});
	}
}
