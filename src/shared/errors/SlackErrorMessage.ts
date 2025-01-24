import { SlackTemplate } from "../slack/domain/SlackTemplate";

export class SlackErrorMessage extends SlackTemplate {
	public readonly channel: string = "raffle-error-notifications";
	public readonly blocks: any[];
	public readonly text: string = "Error at Raffle API";

	constructor(error: Error) {
		super();
		this.blocks = [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "¿Dónde **** está el backend? :fire: :fire:",
				},
			},
			{
				type: "image",
				image_url:
					"https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3Q4d2tydGNsaTFhNDBsM2tjYWtkZDk2em10Yml5c2JxcjdlemxqOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RfvBXK1m8Kcdq/giphy.gif",
				alt_text: "funny GIF",
			},
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: error.stack,
				},
			},
		];
	}
}
