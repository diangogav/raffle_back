import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";
import { Hash } from "../../../shared/Hash";
import { UpdateUserParams } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class UserUpdater {
	constructor(
		private readonly repository: UserRepository,
		private readonly hash: Hash,
	) {}

	async update(
		userId: string,
		payload: UpdateUserParams & { password?: string; newPassword?: string },
	): Promise<void> {
		const user = await this.repository.findById(userId);

		if (!user) {
			throw new NotFoundError(`User with id ${userId} not found`);
		}

		if (payload.newPassword) {
			if (!payload.password) {
				throw new UnauthorizedError("Current password is required to set a new password");
			}

			const isCurrentPasswordValid = await this.hash.compare(payload.password, user.password);

			if (!isCurrentPasswordValid) {
				throw new UnauthorizedError("Current password is incorrect");
			}
		}

		let updatedPassword = user.password;
		if (payload.newPassword) {
			updatedPassword = await this.hash.hash(payload.newPassword);
		}

		const userUpdated = user.update({
			...payload,
			password: updatedPassword,
		});

		await this.repository.create(userUpdated);
	}
}
