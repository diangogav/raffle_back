import { ExchangeRateEntity } from "src/shared/database/infrastructure/postgres/entities/ExchangeRateEntity";

import { dataSource } from "../../database/infrastructure/postgres/data-source";
import { ExchangeRate } from "../domain/ExchangeRate";
import { ExchangeRateRepository } from "../domain/ExchangeRateRepository";

export class ExchangeRatePostgresRepository implements ExchangeRateRepository {
	async dollarToBCVRate(): Promise<ExchangeRate> {
		const repository = dataSource.getRepository(ExchangeRateEntity);
		const exchangeRate = await repository.findOne({
			where: {
				to: "BCV",
				from: "Dollar",
			},
			order: {
				date: "DESC",
			},
		});

		if (!exchangeRate) {
			throw new Error("Exchange rate not found");
		}

		return new ExchangeRate(
			exchangeRate.date.toISOString(),
			exchangeRate.from,
			exchangeRate.to,
			exchangeRate.price,
		);
	}
}
