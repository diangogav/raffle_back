import { ExchangeRate } from "../domain/ExchangeRate";
import { ExchangeRateRepository } from "../domain/ExchangeRateRepository";

import { config } from "./../../../config/index";
import { dataSource } from "./../../database/infrastructure/postgres/data-source";
import { ExchangeRateEntity } from "./../../database/infrastructure/postgres/entities/ExchangeRateEntity";

interface Monitor {
	change: number; // e.g., 0.41
	color: "green" | "red" | "neutral";
	image: string; // image URL
	last_update: string; // e.g., "19/12/2024, 12:00 AM"
	percent: number; // e.g., 0.8
	price: number; // e.g., 50.95
	price_old: number; // e.g., 50.54
	symbol: string; // e.g., "▲" o "▼"
	title: string; // e.g., "Dólar estadounidense"
}

interface ExchangeRateResponse {
	datetime: {
		date: string; // e.g., "miércoles, 18 de diciembre de 2024"
		time: string; // e.g., "4:09:59 p.m."
	};
	monitors: {
		bcv: Monitor;
		enparalelovzla: Monitor;
	};
}

export class PyDollarExchangeRate implements ExchangeRateRepository {
	private readonly API_TOKEN = config.pyDollar.token;

	async dollarToBCVRate(): Promise<ExchangeRate> {
		const response = await fetch("https://pydolarve.org/api/v1/dollar", {
			headers: {
				Authorization: `Bearer ${this.API_TOKEN}`,
			},
		});

		if (!response.ok) {
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

		const data: ExchangeRateResponse = await response.json();

		return new ExchangeRate(data.monitors.bcv.last_update, "Dollar", "BCV", data.monitors.bcv.price);
	}
}
