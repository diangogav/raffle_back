import { SlackTemplate } from "./SlackTemplate";

export abstract class SlackMessageSender {
	abstract send({ template }: { template: SlackTemplate }): Promise<void>;
}
