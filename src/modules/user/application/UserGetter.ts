import { UserRepository } from "../domain/UserRepository";

export class UserGetter {
	constructor(private readonly repository: UserRepository) {}

	async get(): Promise<unknown[]> {
		const users = await this.repository.get();

		return users.map((user) => user.toJson());
	}
}
