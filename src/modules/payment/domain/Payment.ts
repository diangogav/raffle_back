import { ConflictError } from "../../../shared/errors/ConflictError";

export type PaymentAttributes = {
	id: string;
	reference: string;
	amount: number;
	paymentMethod: string;
	name?: string | null;
	dni?: string | null;
	phone?: string | null;
	email?: string | null;
	userId: string;
	verified: boolean;
};

export type PaymentDateAttributes = {
	createdAt: Date;
	updatedAt: Date;
};

export abstract class Payment {
	public readonly id: string;
	public readonly reference: string;
	public readonly amount: number;
	public readonly paymentMethod: string;
	public readonly name?: string | null;
	public readonly dni?: string | null;
	public readonly phone?: string | null;
	public readonly email?: string | null;
	public readonly userId: string;
	public readonly createdAt: Date;
	public readonly updatedAt: Date;
	public readonly deletedAt: Date | null;
	public readonly verified: boolean;

	constructor(data: PaymentAttributes & PaymentDateAttributes) {
		if (!data.reference) {
			throw new ConflictError("Payment should have a reference.");
		}

		this.id = data.id;
		this.reference = data.reference;
		this.amount = data.amount;
		this.paymentMethod = data.paymentMethod;
		this.name = data.name;
		this.dni = data.dni;
		this.phone = data.phone;
		this.email = data.email;
		this.userId = data.userId;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;
		this.verified = data.verified;
	}
}
