import Slack from "@slack/bolt";

import { config } from "../../../config";
import { SlackMessageSender } from "../domain/SlackMessageSender";
import { SlackTemplate } from "../domain/SlackTemplate";

export class SlackBoltMessageSender extends SlackMessageSender {
	private readonly slack: Slack.App;

	constructor() {
		super();
		this.slack = new Slack.App({
			signingSecret: config.slack.signingSecret,
			token: config.slack.botToken,
		});
	}

	async send({ template }: { template: SlackTemplate }): Promise<void> {
		await this.slack.client.chat.postMessage({
			token: config.slack.botToken,
			channel: template.channel,
			text: template.text,
			blocks: template.blocks,
		});
	}
}
