import { NotFoundError } from "../../../shared/errors";
import { UserRepository } from "../domain/UserRepository";

export class UserFinder {
	constructor(private readonly repository: UserRepository) {}

	async find({ userId }: { userId: string }): Promise<unknown> {
		const user = await this.repository.findById(userId);

		if (!user) {
			throw new NotFoundError(`User with id ${userId} not found`);
		}

		return user.toJson();
	}
}
