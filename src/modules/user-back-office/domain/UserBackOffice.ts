import { UserName } from "./../../user/domain/value-objects/UserName";

export type UserAttributes = {
	id: string;
	name: string;
	lastName?: string | null;
	email: string;
	phone?: string | null;
	unverifiedTicketsCount: number;
};

export type UserDateAttributes = {
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date | null;
};

export class UserBackOffice {
	public readonly id: string;
	public readonly name: string;
	public readonly lastName: string | null;
	public readonly email: string;
	public readonly phone: string | null;
	public readonly createdAt: Date;
	public readonly updatedAt: Date;
	public readonly deletedAt: Date | null;
	public readonly unverifiedTicketsCount: number;

	private constructor(data: UserAttributes & UserDateAttributes) {
		this.id = data.id;
		this.name = new UserName(data.name).value;
		this.lastName = data.lastName ?? null;
		this.email = data.email;
		this.phone = data.phone ?? null;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;
		this.deletedAt = data.deletedAt ?? null;
		this.unverifiedTicketsCount = data.unverifiedTicketsCount;
	}

	static from(data: UserAttributes & UserDateAttributes): UserBackOffice {
		return new UserBackOffice(data);
	}

	toJson(): UserAttributes {
		return {
			id: this.id,
			name: this.name,
			email: this.email,
			lastName: this.lastName,
			phone: this.phone,
			unverifiedTicketsCount: this.unverifiedTicketsCount,
		};
	}
}
