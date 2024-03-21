import ArgumentPair, { skipEmptyArguments } from "./ArgumentPair";
import CMakeUnit from "./CMakeUnit";

export enum LibraryType {
	static,
	shared,
	module,
	interface
}

interface AddLibraryOptions {
	excludeFromAll?: boolean;
	type?: LibraryType;
}

export class AddLibrary implements CMakeUnit {
	private name: ArgumentPair;
	private type?: ArgumentPair;
	private excludeFromAll?: ArgumentPair;
	// not set sources in add_library function (my prerogative)

	private static readonly functionName: string = "add_library";

	constructor(name: string, options?: AddLibraryOptions) {
		this.name = new ArgumentPair(name);
		if (options?.type !== undefined) { this.type = new ArgumentPair(LibraryType[options.type].toUpperCase()); }
		if (options?.excludeFromAll) { this.excludeFromAll = new ArgumentPair("EXCLUDE_FROM_ALL"); }
	}

	toString(): string {
		const fields = skipEmptyArguments(this.type, this.excludeFromAll);
		let res = fields.map(f => f.toString({intendationSize: 4})).join(" ");
		if (res.length > 0) { res = " " + res; }
		return `${AddLibrary.functionName}(${this.name}${res})`;
	}
}

export class AddLibraryAlias implements CMakeUnit {
	private target: ArgumentPair;
	private alias: ArgumentPair;

	private static readonly functionName: string = "add_library";

	constructor(target: string, alias: string) {
		this.target = new ArgumentPair(target);
		this.alias = new ArgumentPair(alias);
	}

	toString(): string {
		return `${AddLibraryAlias.functionName}(${this.alias} ALIAS ${this.target})`;
	}
}
