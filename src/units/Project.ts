import ArgumentPair, { skipEmptyArguments } from "./ArgumentPair";
import CMakeUnit from "./CMakeUnit";

export interface ProjectOptions {
	version?: string;
	description?: string;
	homePage?: string;
	languages?: string[];
}

export default class Project implements CMakeUnit {
	private projectName: ArgumentPair;
	private version?: ArgumentPair;
	private description?: ArgumentPair;
	private homePage?: ArgumentPair;
	private languages?: ArgumentPair;

	private static readonly functionName: string = "project";

	constructor(name: string, options?: ProjectOptions) {
		this.projectName = new ArgumentPair(name);

		if (!options) { return; }
		if (options.version && options.version.length > 0) { this.version = new ArgumentPair("VERSION", options.version); }
		if (options.description && options.description.length > 0) { this.description = new ArgumentPair("DESCRIPTION", options.description); }
		if (options.homePage && options.homePage.length > 0) { this.description = new ArgumentPair("HOMEPAGE_URL", options.homePage); }
		if (options.languages && options.languages.length > 0) { this.languages = new ArgumentPair("LANGUAGES", ...options.languages); }
	}

	public toString(): string {
		const fields = skipEmptyArguments(this.version, this.description, this.homePage, this.languages);
		const res = "\n" + fields.map(f => f.toString({intendationSize: 4})).join("\n");
		return `${Project.functionName}(${this.projectName.toString()}${res})\n`;
	}
}
