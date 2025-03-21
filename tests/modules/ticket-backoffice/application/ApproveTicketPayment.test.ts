import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, it } from "bun:test";
import { mock, MockProxy } from "jest-mock-extended";
import { EventBus } from "src/shared/event-bus/domain/EventBus";

import { Payment } from "../../../../src/modules/payment/domain/Payment";
import { PaymentStatus } from "../../../../src/modules/payment/domain/PaymentStatus";
import { ApproveTicketPayment } from "../../../../src/modules/ticket-backoffice/application/ApproveTicketPayment";
import { TicketBackOfficeRepository } from "../../../../src/modules/ticket-backoffice/domain/TicketBackOfficeRepository";
import { NotFoundError } from "../../../../src/shared/errors";
import { PaymentMother } from "../mothers/PaymentMother";

import { TicketPaymentApprovedDomainEvent } from "./../../../../src/modules/ticket-backoffice/domain/TicketPaymentApprovedDomainEvent";

describe("ApproveTicketPayment", () => {
	let ticketId: string;
	let payment: Payment;
	let repository: MockProxy<TicketBackOfficeRepository>;
	let eventBus: MockProxy<EventBus>;
	let useCase: ApproveTicketPayment;

	beforeEach(async () => {
		ticketId = faker.string.uuid();
		payment = PaymentMother.create({ status: PaymentStatus.PENDING });
		repository = mock();
		eventBus = mock();
		useCase = new ApproveTicketPayment(repository, eventBus);

		repository.getTicketPayment.mockResolvedValue(payment);
	});

	it("Should change payment status to APPROVED", async () => {
		await useCase.approve({ ticketId });
		expect(repository.getTicketPayment).toHaveBeenCalledTimes(1);
		expect(repository.getTicketPayment).toHaveBeenCalledWith({ ticketId });
		expect(repository.update).toHaveBeenCalledTimes(1);
		expect(repository.update).toHaveBeenCalledWith(payment);
		expect(payment.status).toBe(PaymentStatus.APPROVED);
		expect(eventBus.publish).toHaveBeenCalledTimes(1);
		expect(eventBus.publish).toHaveBeenCalledWith(
			TicketPaymentApprovedDomainEvent.DOMAIN_EVENT,
			new TicketPaymentApprovedDomainEvent({ paymentId: payment.id, userId: payment.userId }),
		);
	});

	it("Should throw a Not Found Error if ticket is not found", async () => {
		repository.getTicketPayment.mockResolvedValue(null);
		expect(useCase.approve({ ticketId })).rejects.toThrow(
			new NotFoundError(`Payment for ticket ${ticketId} not found`),
		);
	});
});
