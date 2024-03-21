import ArgumentPair from "./ArgumentPair";
import CMakeUnit from "./CMakeUnit";

export default class Set implements CMakeUnit {
	private variable: ArgumentPair;

	private static readonly functionName: string = "set";

	constructor(name: string, ...values: string[]) {
		this.variable = new ArgumentPair(name, ...values);
	}

	public toString(): string {
		return `${Set.functionName}(${this.variable.toString()})\n`;
	}
}
