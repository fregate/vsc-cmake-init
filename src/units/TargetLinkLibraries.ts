import ArgumentPair, { filterEmptyArguments } from "./ArgumentPair";
import CMakeUnit from "./CMakeUnit";

interface TargetLinkLibrariesOptions {
	publicLibraries?: string[];
	privateLibraries?: string[];
	interfaceLibraries?: string[];
}

export default class TargetLinkLibraries implements CMakeUnit {
	private target: ArgumentPair;
	private publicLibraries?: ArgumentPair;
	private privateLibraries?: ArgumentPair;
	private interfaceLibraries?: ArgumentPair;

	private static readonly functionName: string = "target_link_libraries";

	constructor(target: string, options?: TargetLinkLibrariesOptions) {
		this.target = new ArgumentPair(target);

		// TODO check options interface Libraries agains public and private

		if (options?.publicLibraries) { this.publicLibraries = new ArgumentPair("PUBLIC", ...options.publicLibraries); }
		if (options?.privateLibraries) { this.privateLibraries = new ArgumentPair("PRIVATE", ...options.privateLibraries); }
		if (options?.interfaceLibraries) { this.interfaceLibraries = new ArgumentPair("INTERFACE", ...options.interfaceLibraries); }
	}

	public toString(): string {
		const fields = filterEmptyArguments(this.publicLibraries, this.privateLibraries, this.interfaceLibraries);
		const res = "\n" + fields.map(f => f.toString({intendationSize: 4, multiline: true})).join("\n\n");
		return `${TargetLinkLibraries.functionName}(${this.target}${res})\n`;
	}
}
