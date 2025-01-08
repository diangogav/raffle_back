import { Template } from "./Template";

export interface EmailSender {
	send({ template, to }: { template: Template; to: string }): Promise<void>;
}
