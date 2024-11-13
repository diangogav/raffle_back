import eslintConfigCodely from "eslint-config-codely";

export default [
	...eslintConfigCodely.full,
	{
		ignores: ["node_modules", "postgres_data"],
	},
];
