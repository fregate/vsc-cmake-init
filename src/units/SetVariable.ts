import ArgumentPair from "./ArgumentPair";
import CMakeUnit from "./CMakeUnit";

export default class SetVariable implements CMakeUnit {
	private variable: ArgumentPair;

	private static readonly functionName: string = "set";

	constructor(name: string, ...values: string[]) {
		this.variable = new ArgumentPair(name, ...values);
	}

	public toString(): string {
		return `${SetVariable.functionName}(${this.variable})\n`;
	}
}
