import { User } from "../../../modules/user/domain/User";
import { UserRepository } from "../../../modules/user/domain/UserRepository";
import { NotFoundError } from "../../errors";

export class UserFinderDomainService {
	constructor(private readonly repository: UserRepository) {}

	async find({ userId }: { userId: string }): Promise<User> {
		const user = await this.repository.findById(userId);

		if (!user) {
			throw new NotFoundError(`User with id ${userId} not found`);
		}

		return user;
	}
}
