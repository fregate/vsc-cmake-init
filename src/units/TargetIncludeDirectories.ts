import ArgumentPair, { filterEmptyArguments } from "./ArgumentPair";
import CMakeUnit from "./CMakeUnit";

interface TargetIncludeDirectoriesOptions {
	publicIncludes?: string[];
	privateIncludes?: string[];
	interfaceIncludes?: string[];
}

export default class TargetIncludeDirectories implements CMakeUnit {
	private target: ArgumentPair;
	private publicIncludes?: ArgumentPair;
	private privateIncludes?: ArgumentPair;
	private interfaceIncludes?: ArgumentPair;

	private static readonly functionName: string = "target_include_directories";

	constructor(target: string, options?: TargetIncludeDirectoriesOptions) {
		this.target = new ArgumentPair(target);

		// TODO check options interface includes agains public and private

		if (options?.publicIncludes) { this.publicIncludes = new ArgumentPair("PUBLIC", ...options.publicIncludes); }
		if (options?.privateIncludes) { this.privateIncludes = new ArgumentPair("PRIVATE", ...options.privateIncludes); }
		if (options?.interfaceIncludes) { this.interfaceIncludes = new ArgumentPair("INTERFACE", ...options.interfaceIncludes); }
	}

	public toString(): string {
		const fields = filterEmptyArguments(this.publicIncludes, this.privateIncludes, this.interfaceIncludes);
		const res = "\n" + fields.map(f => f.toString({intendationSize: 4, multiline: true})).join("\n\n");
		return `${TargetIncludeDirectories.functionName}(${this.target}${res})\n`;
	}
}
