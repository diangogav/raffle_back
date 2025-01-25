import { DomainEventSubscriber } from "../../../shared/event-bus/infrastructure/InMemoryEventBus";
import { ExchangeRateRepository } from "../../../shared/exchange-rate/domain/ExchangeRateRepository";
import { Logger } from "../../../shared/logger/domain/Logger";
import { SlackMessageSender } from "../../../shared/slack/domain/SlackMessageSender";
import { TicketPurchasedSlackNotificationTemplate } from "../../raffle/tickets/domain/TicketPurchasedSlackNotificationTemplate";
import { TicketsPurchasedDomainEvent } from "../domain/TicketsPurchasedDomainEvent";

export class SendSlackNotificationWhenTicketsPurchased implements DomainEventSubscriber<TicketsPurchasedDomainEvent> {
	static readonly ListenTo = TicketsPurchasedDomainEvent.DOMAIN_EVENT;

	constructor(
		private readonly logger: Logger,
		private readonly slackMessageSender: SlackMessageSender,
		private readonly exchangeRateRepository: ExchangeRateRepository,
	) {}

	async handle(event: TicketsPurchasedDomainEvent): Promise<void> {
		try {
			this.logger.info("Executing SendSlackNotificationWhenTicketsPurchased...");
			this.logger.info(JSON.stringify(event));
			const exchangeRate = await this.exchangeRateRepository.dollarToBCVRate();
			const ticketPriceBCV = this.toFixedNoRound(event.data.ticketPrice * exchangeRate.price, 2);
			const template = new TicketPurchasedSlackNotificationTemplate({
				...event.data,
				ticketPriceBCV,
				bcvRate: exchangeRate.price,
			});
			await this.slackMessageSender.send({ template });
		} catch (error) {
			this.logger.error(error);
		}
	}

	private toFixedNoRound(number: number, decimals: number) {
		const factor = Math.pow(10, decimals);

		return Math.floor(number * factor) / factor;
	}
}
