import bearer from "@elysiajs/bearer";
import { randomUUID } from "crypto";
import { Elysia, t } from "elysia";
import { UserUpdater } from "src/modules/user/application/UserUpdater";
import { UserBackOfficeGetter } from "src/modules/user-back-office/application/UserBackOfficeGetter";
import { UserBackOfficePostgresRepository } from "src/modules/user-back-office/infrastructure/UserBackOfficePostgresRepository";

import { config } from "../../config";
import { PermissionsValidator } from "../../modules/auth/application/PermissionsValidator";
import { UserAuth } from "../../modules/auth/application/UserAuth";
import { Permissions } from "../../modules/auth/domain/Permissions";
import { RoleRepository } from "../../modules/auth/domain/RoleRepository";
import { UserFinder } from "../../modules/user/application/UserFinder";
import { UserRegister } from "../../modules/user/application/UserRegister";
import { UserPostgresRepository } from "../../modules/user/infrastructure/UserPostgresRepository";
import { container } from "../../shared/dependency-injection";
import { Hash } from "../../shared/Hash";
import { JWT } from "../../shared/JWT";
import { Pino } from "../../shared/logger/infrastructure/Pino";

const repository = new UserPostgresRepository();
const userBackOfficeRepository = new UserBackOfficePostgresRepository();
const hash = new Hash();
const logger = new Pino();
const jwt = new JWT(config.jwt);
const roleRepository = container.get(RoleRepository);
const permissionsValidator = new PermissionsValidator(roleRepository, jwt);

export const userRoutes = new Elysia({ prefix: "/users" })
	.post(
		"/signup",
		async ({ body }) => {
			const id = randomUUID();

			return new UserRegister(repository, container.get(RoleRepository), hash, logger, jwt).register({
				...body,
				id,
			});
		},
		{
			body: t.Object({
				name: t.String(),
				password: t.String({ minLength: 8 }),
				email: t.String({
					format: "email",
				}),
				phone: t.String({
					regex: /^\+?[1-9]\d{1,14}$/,
				}),
			}),
			detail: {
				tags: ["Auth"],
			},
		},
	)
	.post(
		"/login",
		async ({ body }) => {
			return new UserAuth(repository, hash, jwt).login(body);
		},
		{
			body: t.Object({
				email: t.String(),
				password: t.String(),
			}),
			detail: {
				tags: ["Auth"],
			},
		},
	)
	.use(bearer())
	.get("/", async ({ bearer }) => {
		jwt.decode(bearer as string) as { id: string };

		await permissionsValidator.validate({
			token: bearer as string,
			requiredPermission: Permissions.BACK_OFFICE_READ_USER,
		});

		return new UserBackOfficeGetter(userBackOfficeRepository).get();
	})
	.use(bearer())
	.get(
		"/profile",
		async ({ bearer }) => {
			const token = jwt.decode(bearer as string) as { id: string };

			await permissionsValidator.validate({
				token: bearer as string,
				requiredPermission: Permissions.READ_USER,
			});

			return new UserFinder(repository).find({ userId: token.id });
		},
		{
			detail: {
				tags: ["Users"],
			},
		},
	)
	.use(bearer())
	.patch(
		"/",
		async ({ body, bearer }) => {
			const token = jwt.decode(bearer as string) as { id: string };

			await permissionsValidator.validate({
				token: bearer as string,
				requiredPermission: Permissions.UPDATE_USER,
			});

			return new UserUpdater(repository, hash).update(token.id, body);
		},
		{
			body: t.Object({
				name: t.Optional(t.String()),
				lastName: t.Optional(t.String()),
				email: t.Optional(
					t.String({
						format: "email",
					}),
				),
				phone: t.Optional(
					t.String({
						regex: /^\+?[1-9]\d{1,14}$/,
					}),
				),
				password: t.Optional(t.String({ minLength: 4 })),
				newPassword: t.Optional(t.String({ minLength: 4 })),
			}),
			detail: {
				tags: ["Users"],
			},
		},
	);
