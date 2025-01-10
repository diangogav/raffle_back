import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, it } from "bun:test";
import { mock, MockProxy } from "jest-mock-extended";
import { EventBus } from "src/shared/event-bus/domain/EventBus";

import { Payment } from "../../../../src/modules/payment/domain/Payment";
import { PaymentStatus } from "../../../../src/modules/payment/domain/PaymentStatus";
import { DenyTicketPayment } from "../../../../src/modules/ticket-backoffice/application/DenyTicketPayment";
import { TicketBackOfficeRepository } from "../../../../src/modules/ticket-backoffice/domain/TicketBackOfficeRepository";
import { NotFoundError } from "../../../../src/shared/errors";
import { PaymentMother } from "../mothers/PaymentMother";

import { TicketPaymentDeniedDomainEvent } from "./../../../../src/modules/ticket-backoffice/domain/TicketPaymentDeniedDomainEvent";

describe("DenyTicketPayment", () => {
	let ticketId: string;
	let payment: Payment;
	let repository: MockProxy<TicketBackOfficeRepository>;
	let useCase: DenyTicketPayment;
	let eventBus: EventBus;

	beforeEach(async () => {
		ticketId = faker.string.uuid();
		payment = PaymentMother.create({ status: PaymentStatus.PENDING });
		repository = mock();
		eventBus = mock();
		useCase = new DenyTicketPayment(repository, eventBus);

		repository.getTicketPayment.mockResolvedValue(payment);
	});

	it("Should change payment status to DENIED", async () => {
		await useCase.deny({ ticketId });
		expect(repository.getTicketPayment).toHaveBeenCalledTimes(1);
		expect(repository.getTicketPayment).toHaveBeenCalledWith({ ticketId });
		expect(repository.update).toHaveBeenCalledTimes(1);
		expect(repository.update).toHaveBeenCalledWith(payment);
		expect(payment.status).toBe(PaymentStatus.DENIED);
		expect(repository.deleteTicket).toHaveBeenCalledTimes(1);
		expect(repository.deleteTicket).toHaveBeenCalledWith({ ticketId });
		expect(eventBus.publish).toBeCalledTimes(1);
		expect(eventBus.publish).toHaveBeenCalledWith(
			TicketPaymentDeniedDomainEvent.DOMAIN_EVENT,
			new TicketPaymentDeniedDomainEvent({
				ticketId,
				userId: payment.userId,
			}),
		);
	});

	it("Should throw a Not Found Error if ticket is not found", async () => {
		repository.getTicketPayment.mockResolvedValue(null);
		expect(useCase.deny({ ticketId })).rejects.toThrow(
			new NotFoundError(`Payment for ticket ${ticketId} not found`),
		);
	});
});
