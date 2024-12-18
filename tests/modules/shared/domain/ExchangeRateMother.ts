import { faker } from "@faker-js/faker";

import { ExchangeRate } from "./../../../../src/shared/exchange-rate/domain/ExchangeRate";

type ExchangeRateMotherParams = {
	date: string;
	from: string;
	to: string;
	percent: number;
	price: number;
};

export class ExchangeRateMother {
	static create(payload?: Partial<ExchangeRateMotherParams>): ExchangeRate {
		return {
			date: faker.date.past().toString(),
			from: faker.finance.currency().name,
			to: faker.finance.currency().name,
			percent: +faker.finance.amount(),
			price: +faker.finance.amount(),
			...payload,
		};
	}
}
