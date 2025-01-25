export type UserRoleAttributes = {
	id: number;
	name: string;
	description: string;
};

export class Role {
	public readonly id: number;
	public readonly name: string;
	public readonly description: string;

	private constructor(data: UserRoleAttributes) {
		this.id = data.id;
		this.name = data.name;
		this.description = data.description;
	}

	static from(data: UserRoleAttributes): Role {
		return new Role({
			id: data.id,
			name: data.name,
			description: data.description,
		});
	}
}
