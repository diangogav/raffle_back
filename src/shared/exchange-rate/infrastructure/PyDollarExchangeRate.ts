import { ExchangeRate } from "../domain/ExchangeRate";
import { ExchangeRateRepository } from "../domain/ExchangeRateRepository";

import { config } from "./../../../config/index";

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

		const data: ExchangeRateResponse = await response.json();

		return new ExchangeRate(
			data.monitors.bcv.last_update,
			"Dollar",
			"BCV",
			data.monitors.bcv.percent,
			data.monitors.bcv.price,
		);
	}
}
