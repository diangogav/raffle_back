import { Template } from "./Template";

export abstract class EmailSender {
	abstract send({ template, to }: { template: Template; to: string }): Promise<void>;
}
