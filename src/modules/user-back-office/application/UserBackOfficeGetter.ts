import { UserBackOfficeRepository } from "../domain/UserBackOfficeRepository";

export class UserBackOfficeGetter {
	constructor(private readonly repository: UserBackOfficeRepository) {}

	async get(): Promise<unknown[]> {
		const users = await this.repository.get();

		return users.map((user) => user.toJson());
	}
}
