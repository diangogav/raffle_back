import { ExchangeRate } from "../domain/ExchangeRate";
import { ExchangeRateRepository } from "../domain/ExchangeRateRepository";

import { ExchangeRatePostgresRepository } from "./ExchangeRatePostgresRepository";
import { PyDollarExchangeRate } from "./PyDollarExchangeRate";

export class ExchangeRateProxyRepository implements ExchangeRateRepository {
	private readonly pyDollar: PyDollarExchangeRate;
	private readonly exchangeRatePostgres: ExchangeRatePostgresRepository;

	constructor() {
		this.pyDollar = new PyDollarExchangeRate();
		this.exchangeRatePostgres = new ExchangeRatePostgresRepository();
	}

	async dollarToBCVRate(): Promise<ExchangeRate> {
		try {
			return await this.pyDollar.dollarToBCVRate();
		} catch (_error) {
			return await this.exchangeRatePostgres.dollarToBCVRate();
		}
	}
}
