import ArgumentPair from "./ArgumentPair";
import CMakeFunction from "./CMakeFunction";

export default class CMakeMinimumRequired extends CMakeFunction {
	private version: ArgumentPair;

	constructor(version: string) {
		super("cmake_minimum_required");
		this.version = new ArgumentPair("VERSION", version);
	}

	public toString(): string {
		return `${this.name}(${this.version.toString()})`;
	}
}
