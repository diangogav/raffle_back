import { BinancePayment } from "./BinancePayment";
import { PagoMovilPayment } from "./PagoMovilPayment";
import { Payment, PaymentAttributes, PaymentDateAttributes } from "./Payment";
import { PaymentMethod } from "./PaymentMethod.enum";

export class PaymentFactory {
	static create(data: Omit<PaymentAttributes, "status">): Payment {
		switch (data.paymentMethod) {
			case PaymentMethod.BINANCE:
				return BinancePayment.create(data);

			case PaymentMethod.PAGO_MOVIL:
				return PagoMovilPayment.create(data);

			default:
				throw new Error("Payment method not allowed");
		}
	}

	static from(data: PaymentAttributes & PaymentDateAttributes): Payment {
		switch (data.paymentMethod) {
			case PaymentMethod.BINANCE:
				return BinancePayment.from(data);

			case PaymentMethod.PAGO_MOVIL:
				return PagoMovilPayment.from(data);

			default:
				throw new Error("Payment method not allowed");
		}
	}
}
