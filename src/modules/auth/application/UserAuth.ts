import { AuthenticationError } from "../../../shared/errors";
import { Hash } from "../../../shared/Hash";
import { JWT } from "../../../shared/JWT";
import { UserRepository } from "../../user/domain/UserRepository";

export class UserAuth {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hash: Hash,
		private readonly jwt: JWT,
	) {}

	async login({ email, password }: { email: string; password: string }): Promise<unknown> {
		const user = await this.userRepository.findByEmail(email.toLowerCase());

		if (!user) {
			throw new AuthenticationError("Wrong email or password");
		}

		const isCorrectPassword = await this.hash.compare(password, user.password);

		if (!isCorrectPassword) {
			throw new AuthenticationError("Wrong email or password");
		}

		const token = this.jwt.generate({ id: user.id, name: user.name, email: user.email, roles: user.rolesName });

		return {
			token,
		};
	}
}
