import * as dotenv from "dotenv";

dotenv.config();

function ensureEnvVariable(variable: string, variableName: string): string {
	if (!variable) {
		throw new Error(`Environment variable ${variableName} is not set`);
	}

	return variable;
}

export const config = {
	env: process.env.NODE_ENV ?? "development",
	postgres: {
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		host: process.env.POSTGRES_HOST ?? "localhost",
		port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
	},
	jwt: {
		secret: ensureEnvVariable(process.env.JWT_SECRET as string, "JWT_SECRET"),
		issuer: ensureEnvVariable(process.env.JWT_ISSUER as string, "JWT_ISSUER"),
	},
	pyDollar: {
		token: ensureEnvVariable(process.env.PY_DOLLAR_AUTH_TOKEN as string, "PY_DOLLAR_AUTH_TOKEN"),
	},
	email: {
		resendApiKey: ensureEnvVariable(process.env.RESEND_API_KEY as string, "RESEND_API_KEY"),
		from: ensureEnvVariable(process.env.EMAIL_FROM as string, "EMAIL_FROM"),
	},
	slack: {
		signingSecret: ensureEnvVariable(process.env.SLACK_SIGNING_SECRET as string, "SLACK_SIGNING_SECRET"),
		botToken: ensureEnvVariable(process.env.SLACK_BOT_TOKEN as string, "SLACK_BOT_TOKEN"),
	},
};
