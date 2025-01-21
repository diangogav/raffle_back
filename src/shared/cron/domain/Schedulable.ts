export interface Schedulable {
	execute(): Promise<void>;
}
