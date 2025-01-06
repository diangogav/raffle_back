import { ConflictError } from "../../../shared/errors/ConflictError";

import { Payment, PaymentAttributes, PaymentDateAttributes } from "./Payment";
import { PaymentStatus } from "./PaymentStatus";

export class PagoMovilPayment extends Payment {
	private constructor(data: PaymentAttributes & PaymentDateAttributes) {
		super(data);
	}

	static create(data: Omit<PaymentAttributes, "status">): Payment {
		const createdAt = new Date();
		const updatedAt = new Date();

		if (!data.phone) {
			throw new ConflictError(`Pago movil payment should have a phone`);
		}

		if (!data.dni) {
			throw new ConflictError(`Pago movil payment should have a dni`);
		}

		return new PagoMovilPayment({
			...data,
			createdAt,
			updatedAt,
			status: PaymentStatus.PENDING,
		});
	}

	static from(data: PaymentAttributes & PaymentDateAttributes): PagoMovilPayment {
		return new PagoMovilPayment(data);
	}
}
