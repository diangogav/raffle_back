import { PaymentMethod } from "../../../payment/domain/PaymentMethod.enum";

export type BuyTicketRequestDto = {
	paymentId: string;
	userId: string;
	ticketNumbers: number[];
	raffleId: string;
	reference: string;
	name?: string;
	dni?: string;
	phone?: string;
	paymentAmount: number;
	email?: string;
	paymentMethod: PaymentMethod;
};
