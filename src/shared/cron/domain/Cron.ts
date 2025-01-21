import { Schedulable } from "./Schedulable";

export abstract class Cron {
	abstract schedule(task: Schedulable): Promise<void>;
}
