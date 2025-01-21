import cron from "node-cron";

import { PostgresTypeORM } from "../../database/infrastructure/postgres/PostgresTypeORM";
import { Cron } from "../domain/Cron";
import { Schedulable } from "../domain/Schedulable";

export class NodeCron extends Cron {
	async schedule(task: Schedulable): Promise<void> {
		cron.schedule("* * * * *", async () => {
			const transaction = PostgresTypeORM.getInstance();

			try {
				await transaction.openTransaction();
				await task.execute();
				await transaction.commit();
			} catch (error) {
				await transaction.rollback();
				throw error;
			} finally {
				await transaction.closeTransaction();
			}
		});
	}
}
