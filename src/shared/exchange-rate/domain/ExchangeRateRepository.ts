import { ExchangeRate } from "./ExchangeRate";

export abstract class ExchangeRateRepository {
	abstract dollarToBCVRate(): Promise<ExchangeRate>;
}
