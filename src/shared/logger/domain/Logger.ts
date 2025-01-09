export abstract class Logger {
	abstract debug(message: unknown): void;
	abstract error(error: string | Error): void;
	abstract info(message: unknown): void;
}
