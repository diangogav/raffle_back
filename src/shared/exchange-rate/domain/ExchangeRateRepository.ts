import { ExchangeRate } from "./ExchangeRate";

export interface ExchangeRateRepository {
	dollarToBCVRate(): Promise<ExchangeRate>;
}
