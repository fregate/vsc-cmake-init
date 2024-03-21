import ArgumentPair from "./ArgumentPair";
import CMakeUnit from "./CMakeUnit";

export class AddExecutable implements CMakeUnit {
	private name: ArgumentPair;

	private static readonly functionName: string = "add_executable";

	constructor(name: string) {
		this.name = new ArgumentPair(name);
	}

	toString(): string {
		return `${AddExecutable.functionName}(${this.name})`;
	}
}

export class AddExecutableAlias implements CMakeUnit {
	private target: ArgumentPair;
	private alias: ArgumentPair;

	private static readonly functionName: string = "add_executable";

	constructor(target: string, alias: string) {
		this.target = new ArgumentPair(target);
		this.alias = new ArgumentPair(alias);
	}

	toString(): string {
		return `${AddExecutableAlias.functionName}(${this.alias} ALIAS ${this.target})`;
	}
}
