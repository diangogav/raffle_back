import { SlackTemplate } from "src/shared/slack/domain/SlackTemplate";

import { TicketsPurchasedPayload } from "../../../ticket-backoffice/domain/TicketsPurchasedDomainEvent";

export class TicketPurchasedSlackNotificationTemplate extends SlackTemplate {
	public readonly channel: string = "raffle-tickets-payment";
	public readonly blocks: any[];
	public readonly text: string = "¡Pago de Rifa Realizado!* 🎉";

	constructor(data: TicketsPurchasedPayload & { ticketPriceBCV: number; bcvRate: number }) {
		super();
		this.blocks = [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "*          \t\t\t\t\t\t\t¡Pago de Rifa Realizado!* 🎉\n\n",
				},
			},
			{
				type: "section",
				fields: [
					{
						type: "mrkdwn",
						text: `*Raffle Title:*\n${data.raffleTitle}`,
					},
					{
						type: "mrkdwn",
						text: `
							*Ticket Price:* ${data.ticketPrice} USD - *Ticket Price BCV:* ${data.ticketPriceBCV} BCV - *BCV Rate:* ${data.bcvRate} BCV
						`,
					},
					{
						type: "mrkdwn",
						text: `*Ticket Numbers:*\n${data.ticketsNumbers.join(", ")}`,
					},
					{
						type: "mrkdwn",
						text: `*Amount Paid:*\n*${data.paymentAmount}* 💰`,
					},
					{
						type: "mrkdwn",
						text: `*Payment Method:*\n${data.paymentMethod}`,
					},
					{
						type: "mrkdwn",
						text: `*Payment Reference:*\n${data.paymentReference}`,
					},
					{
						type: "mrkdwn",
						text: `*Payment Date:*\n${data.paymentDate}`,
					},
					{
						type: "mrkdwn",
						text: `*User Email:*\n${data.email}`,
					},
					{
						type: "mrkdwn",
						text: `*User DNI:*\n${data.dni}`,
					},
					{
						type: "mrkdwn",
						text: `*User Phone:*\n${data.phone}`,
					},
				],
			},
			{
				type: "section",
				fields: [
					{
						type: "mrkdwn",
						text: "\n\n\n",
					},
				],
			},
			{
				type: "image",
				image_url:
					"https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzl0dWN1YmR0MWh1NWtoMW55YTg2ZHNyZHFpdDhvZWNuZnV5MG5uOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/67ThRZlYBvibtdF9JH/giphy.gif",
				alt_text: "funny GIF",
			},
		];
	}
}
