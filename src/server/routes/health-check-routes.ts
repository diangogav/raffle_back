import { Elysia } from "elysia";

export const healthCheckRoutes = new Elysia({ prefix: "/" }).get("/", async () => {
	return "Hello World!!!";
});
