import { Resend } from "resend";

import { EmailSender } from "../domain/EmailSender";
import { Template } from "../domain/Template";

import { config } from "./../../../config/index";
import { Logger } from "./../../logger/domain/Logger";

export class ResendEmailSender implements EmailSender {
	private readonly resend: Resend;

	constructor(private readonly logger: Logger) {
		this.resend = new Resend(config.email.resendApiKey);
	}

	async send({ template, to }: { template: Template; to: string }): Promise<void> {
		const { data, error } = await this.resend.emails.send({
			from: config.email.from,
			to,
			subject: template.subject,
			html: template.value(),
		});

		if (error) {
			this.logger.error("Error sending email");
			this.logger.error(error);

			return;
		}

		this.logger.info(`Email sent correctly: ${JSON.stringify(data)}`);
	}
}
