import ArgumentPair from "./ArgumentPair";
import CMakeUnit from "./CMakeUnit";

export default class CMakeMinimumRequired implements CMakeUnit {
	private version: ArgumentPair;

	private static readonly functionName: string = "cmake_minimum_required";

	constructor(version: string) {
		this.version = new ArgumentPair("VERSION", version);
	}

	public toString(): string {
		return `${CMakeMinimumRequired.functionName}(${this.version})\n`;
	}
}
