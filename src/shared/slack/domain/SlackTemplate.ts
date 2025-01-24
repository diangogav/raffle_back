export abstract class SlackTemplate {
	abstract channel: string;
	abstract blocks: any[];
	abstract text: string;
}
