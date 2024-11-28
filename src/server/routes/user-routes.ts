import { randomUUID } from "crypto";
import { Elysia, t } from "elysia";

import { config } from "../../config";
import { UserAuth } from "../../modules/auth/application/UserAuth";
import { UserRegister } from "../../modules/user/application/UserRegister";
import { UserPostgresRepository } from "../../modules/user/infrastructure/UserPostgresRepository";
import { Hash } from "../../shared/Hash";
import { JWT } from "../../shared/JWT";
import { Pino } from "../../shared/logger/infrastructure/Pino";

const repository = new UserPostgresRepository();
const hash = new Hash();
const logger = new Pino();
const jwt = new JWT(config.jwt);

export const userRoutes = new Elysia({ prefix: "/users" })
	.post(
		"/signup",
		async ({ body }) => {
			const id = randomUUID();

			return new UserRegister(repository, hash, logger).register({ ...body, id });
		},
		{
			body: t.Object({
				name: t.String(),
				password: t.String({ minLength: 4 }),
				email: t.String({
					format: "email",
				}),
			}),
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
		},
	);