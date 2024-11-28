import { dataSource } from "../../../shared/database/infrastructure/postgres/data-source";
import { UserEntity } from "../../../shared/database/infrastructure/postgres/entities/UserEntity";
import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class UserPostgresRepository implements UserRepository {
	async create(user: User): Promise<void> {
		const repository = dataSource.getRepository(UserEntity);
		const userProfileEntity = repository.create({
			id: user.id,
			password: user.password,
			email: user.email,
			name: user.name,
		});
		await repository.save(userProfileEntity);
	}

	async findByEmail(email: string): Promise<User | null> {
		const repository = dataSource.getRepository(UserEntity);
		const userEntity = await repository.findOne({
			where: {
				email,
			},
		});

		if (!userEntity) {
			return null;
		}

		return User.from(userEntity);
	}

	async findById(id: string): Promise<User | null> {
		const repository = dataSource.getRepository(UserEntity);
		const userEntity = await repository.findOne({ where: { id } });

		if (!userEntity) {
			return null;
		}

		return User.from(userEntity);
	}
}
