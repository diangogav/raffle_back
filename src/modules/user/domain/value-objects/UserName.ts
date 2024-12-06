import { InvalidArgumentError } from "src/shared/errors";

export class UserName {
	public readonly value: string;
	constructor(name: string) {
		this.ensureNameIsCorrect(name);
		this.value = name;
	}

	ensureNameIsCorrect(name: string): void {
		if (name.length > 20 || name.length <= 0) {
			throw new InvalidArgumentError(`name should be greater than 0 and less or equal than 20`);
		}
	}
}
