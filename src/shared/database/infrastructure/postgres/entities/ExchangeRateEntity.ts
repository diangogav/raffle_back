import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
	name: "exchange_rates",
})
export class ExchangeRateEntity {
	@PrimaryColumn("uuid")
	id: string;

	@Column({ type: "varchar" })
	from: string;

	@Column({ type: "varchar" })
	to: string;

	@Column({ type: "timestamp" })
	date: Date;

	@Column({ type: "varchar" })
	price: number;
}
