import cron from "node-cron";

import { Cron } from "../domain/Cron";
import { Schedulable } from "../domain/Schedulable";

export class NodeCron extends Cron {
	async schedule(task: Schedulable): Promise<void> {
		cron.schedule("* * * * *", async () => {
			await task.execute();
		});
	}
}
