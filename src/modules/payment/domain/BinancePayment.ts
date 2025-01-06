import { ConflictError } from "../../../shared/errors/ConflictError";

import { Payment, PaymentAttributes, PaymentDateAttributes } from "./Payment";
import { PaymentStatus } from "./PaymentStatus";

export class BinancePayment extends Payment {
	private constructor(data: PaymentAttributes & PaymentDateAttributes) {
		super(data);
	}

	static create(data: Omit<PaymentAttributes, "status">): Payment {
		const createdAt = new Date();
		const updatedAt = new Date();

		if (!data.email) {
			throw new ConflictError(`Binance payment should have a email`);
		}

		return new BinancePayment({
			...data,
			createdAt,
			updatedAt,
			status: PaymentStatus.PENDING,
		});
	}
}
