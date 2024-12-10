import { Payment } from "./Payment";

export interface PaymentRepository {
	save(payment: Payment): Promise<void>;
}
