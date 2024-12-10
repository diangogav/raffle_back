import { beforeEach, describe, expect, it } from "bun:test";
import { mock, MockProxy } from "jest-mock-extended";
import { PaymentRepository } from "src/modules/payment/domain/PaymentRepository";

import { PaymentMethod } from "../../../../src/modules/payment/domain/PaymentMethod.enum";
import { BuyTicket } from "../../../../src/modules/raffle/application/BuyTicket";
import { BuyTicketRequestDto } from "../../../../src/modules/raffle/application/dtos/BuyTicketRequestDto";
import { Raffle } from "../../../../src/modules/raffle/domain/Raffle";
import { RaffleRepository } from "../../../../src/modules/raffle/domain/RaffleRepository";
import { RaffleStatus } from "../../../../src/modules/raffle/domain/RaffleStatus.enum";
import { Ticket } from "../../../../src/modules/raffle/tickets/domain/Ticket";
import { ConflictError, InvalidArgumentError } from "../../../../src/shared/errors";
import { BuyTicketRequestDtoMother } from "../mothers/BuyTicketRequestDtoMother";
import { RaffleMother } from "../mothers/RaffleMother";
import { TicketMother } from "../mothers/TicketMother";

describe("BuyTicket", () => {
	let useCase: BuyTicket;
	let repository: MockProxy<RaffleRepository>;
	let paymentRepository: MockProxy<PaymentRepository>;
	let request: BuyTicketRequestDto;
	let raffle: Raffle;
	let ticket: Ticket;

	beforeEach(() => {
		request = BuyTicketRequestDtoMother.create({ ticketNumbers: [20] });
		repository = mock();
		paymentRepository = mock();
		useCase = new BuyTicket(repository, paymentRepository);
		ticket = TicketMother.create({ raffleId: request.raffleId, ticketNumber: "6" });
		raffle = RaffleMother.create({ id: request.raffleId, status: RaffleStatus.ONGOING, tickets: [ticket] });
		repository.findById.mockResolvedValue(raffle);
	});

	it("Should take a ticket correctly", async () => {
		await useCase.buy(request);
		expect(repository.findById).toBeCalledTimes(1);
		expect(repository.findById).toHaveBeenCalledWith(request.raffleId);
		expect(repository.saveTicket).toHaveBeenCalledTimes(1);
		expect(raffle.ticketsPurchased).toEqual([6, 20]);
		expect(paymentRepository.save).toHaveBeenCalledTimes(1);
	});

	it("Should throw and error if ticket is already taken", async () => {
		request.ticketNumbers = [6, 20];
		request.paymentAmount = raffle.ticketPrice * request.ticketNumbers.length * 2;
		expect(useCase.buy(request)).rejects.toThrow(new ConflictError(`Ticket 6 already taken.`));
	});

	it("Should throw and error if ticket is out of range of total tickets", async () => {
		const outOfRangeTicket = raffle.totalTickets + 1;
		request.ticketNumbers = [outOfRangeTicket];
		expect(useCase.buy(request)).rejects.toThrow(new InvalidArgumentError(`Ticket ${outOfRangeTicket} not valid`));
	});

	it("Should throw and error if raffle status is distinct to ONGOING", async () => {
		raffle = RaffleMother.notOngoing({ id: raffle.id, tickets: [ticket] });
		repository.findById.mockResolvedValue(raffle);
		expect(useCase.buy(request)).rejects.toThrow(new Error(`Raffle with id ${raffle.id} not active.`));
	});

	it("Should throw and error if raffle status is distinct to ONGOING", async () => {
		ticket = TicketMother.create({ raffleId: request.raffleId, ticketNumber: "1" });
		request.ticketNumbers = [2];
		raffle = RaffleMother.create({
			status: RaffleStatus.ONGOING,
			totalTickets: 2,
			tickets: [ticket],
			id: request.raffleId,
		});
		repository.findById.mockResolvedValue(raffle);
		await useCase.buy(request);
		expect(raffle.status).toBe(RaffleStatus.CLOSED);
	});

	it("Should throw an error if payment amount is less than total tickets prices", async () => {
		request.paymentAmount = raffle.ticketPrice - 5;

		expect(useCase.buy(request)).rejects.toThrow(new ConflictError(`Insufficient amount.`));
	});

	it("Should throw an error if Binance payment does not include email", async () => {
		request.paymentMethod = PaymentMethod.BINANCE;
		request.email = undefined;

		expect(useCase.buy(request)).rejects.toThrow(new ConflictError(`Binance payment should have a email`));
	});

	it("Should throw an error if Pago Movil payment does not include phone", async () => {
		request.paymentMethod = PaymentMethod.PAGO_MOVIL;
		request.phone = undefined;

		expect(useCase.buy(request)).rejects.toThrow(new ConflictError(`Pago movil payment should have a phone`));
	});

	it("Should throw an error if Pago Movil payment does not include DNI", async () => {
		request.paymentMethod = PaymentMethod.PAGO_MOVIL;
		request.dni = undefined;

		expect(useCase.buy(request)).rejects.toThrow(new ConflictError(`Pago movil payment should have a dni`));
	});
});
