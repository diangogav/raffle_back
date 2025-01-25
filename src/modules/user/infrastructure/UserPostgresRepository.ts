import { In } from "typeorm";

import { dataSource } from "../../../shared/database/infrastructure/postgres/data-source";
import { UserEntity } from "../../../shared/database/infrastructure/postgres/entities/UserEntity";
import { Role } from "../../../shared/role/domain/Role";
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
			lastName: user.lastName,
			address: user.address,
			phone: user.phone,
			roles: user.roles,
		});
		await repository.save(userProfileEntity);
	}

	async findByEmail(email: string): Promise<User | null> {
		const repository = dataSource.getRepository(UserEntity);
		const userEntity = await repository.findOne({
			where: {
				email,
			},
			relations: ["roles"],
		});

		if (!userEntity) {
			return null;
		}

		const roles = userEntity.roles.map((role) => Role.from(role));

		return User.from({ ...userEntity, roles });
	}

	async findById(id: string): Promise<User | null> {
		const repository = dataSource.getRepository(UserEntity);
		const userEntity = await repository.findOne({ where: { id }, relations: ["roles"] });

		if (!userEntity) {
			return null;
		}

		const roles = userEntity.roles.map((role) => Role.from(role));

		return User.from({ ...userEntity, roles });
	}

	async get(): Promise<User[]> {
		const repository = dataSource.getRepository(UserEntity);
		const userEntities = await repository.find();

		return userEntities.map((user) => User.from(user));
	}

	async findByIds(ids: string[]): Promise<User[]> {
		const repository = dataSource.getRepository(UserEntity);

		const userEntities = await repository.find({
			where: { id: In(ids) },
		});

		return userEntities.map((user) => User.from(user));
	}
}
