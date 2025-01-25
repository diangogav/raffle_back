import { Role } from "../../auth/domain/Role";

import { UserName } from "./value-objects/UserName";

export type UpdateUserParams = {
	name?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	password?: string;
};

export type UserAttributes = {
	id: string;
	name: string;
	password: string;
	lastName?: string | null;
	address?: string | null;
	email: string;
	phone?: string | null;
	dni?: string | null;
	avatar?: string | null;
	roles: Role[];
};

export type UserDateAttributes = {
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date | null;
};

export class User {
	public readonly id: string;
	public readonly name: string;
	public readonly password: string;
	public readonly lastName: string | null;
	public readonly address: string | null;
	public readonly email: string;
	public readonly phone: string | null;
	public readonly dni: string | null;
	public readonly avatar: string | null;
	public readonly createdAt: Date;
	public readonly updatedAt: Date;
	public readonly deletedAt: Date | null;
	private readonly _roles: Role[];

	private constructor(data: UserAttributes & UserDateAttributes) {
		this.id = data.id;
		this.name = new UserName(data.name).value;
		this.password = data.password;
		this.lastName = data.lastName ?? null;
		this.address = data.address ?? null;
		this.email = data.email;
		this.phone = data.phone ?? null;
		this.dni = data.dni ?? null;
		this.avatar = data.avatar ?? null;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;
		this.deletedAt = data.deletedAt ?? null;
		this._roles = data.roles;
	}

	static create(data: UserAttributes): User {
		const createdAt = new Date();
		const updatedAt = new Date();
		const email = data.email.toLowerCase();

		return new User({ ...data, email, createdAt, updatedAt, deletedAt: null });
	}

	static from(data: UserAttributes & UserDateAttributes): User {
		return new User(data);
	}

	update(payload: UpdateUserParams): User {
		return new User({
			...this,
			...payload,
		});
	}

	toJson(): Omit<UserAttributes, "password" | "roles"> {
		return {
			id: this.id,
			name: this.name,
			email: this.email,
			lastName: this.lastName,
			phone: this.phone,
		};
	}

	get roles(): Role[] {
		return [...this._roles];
	}
}
