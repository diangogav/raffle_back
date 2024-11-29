import { ConflictError } from "../../../shared/errors";
import { Hash } from "../../../shared/Hash";
import { JWT } from "../../../shared/JWT";
import { Logger } from "../../../shared/logger/domain/Logger";
import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class UserRegister {
	constructor(
		private readonly repository: UserRepository,
		private readonly hash: Hash,
		private readonly logger: Logger,
		private readonly jwt: JWT,
	) {}

	async register({
		id,
		name,
		email,
		password,
	}: {
		id: string;
		name: string;
		email: string;
		password: string;
	}): Promise<unknown> {
		this.logger.info(`Creating new user with email: ${email} and name: ${name}`);

		const existingUser = await this.repository.findByEmail(email);

		if (existingUser) {
			throw new ConflictError(`User with email ${email} already exists`);
		}

		const passwordHashed = await this.hash.hash(password);

		const user = User.create({ id, name, email, password: passwordHashed });

		await this.repository.create(user);

		const token = this.jwt.generate({ id: user.id, name: user.name, email: user.email });

		return {
			token,
		};
	}
}
