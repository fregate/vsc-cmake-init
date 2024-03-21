import ArgumentPair, { skipEmptyArguments } from "./ArgumentPair";
import CMakeUnit from "./CMakeUnit";

interface TargetSourcesOptions {
	publicSources?: string[];
	privateSources?: string[];
	interfaceSources?: string[];
}

export default class TargetSources implements CMakeUnit {
	private target: ArgumentPair;
	private publicSources?: ArgumentPair;
	private privateSources?: ArgumentPair;
	private interfaceSources?: ArgumentPair;

	private static readonly functionName: string = "target_sources";

	constructor(target: string, options?: TargetSourcesOptions) {
		this.target = new ArgumentPair(target);

		// TODO check interface sources agains public and private

		if (options?.publicSources) { this.publicSources = new ArgumentPair("PUBLIC", ...options.publicSources); }
		if (options?.privateSources) { this.privateSources = new ArgumentPair("PRIVATE", ...options.privateSources); }
		if (options?.interfaceSources) { this.interfaceSources = new ArgumentPair("INTERFACE", ...options.interfaceSources); }
	}

	public toString(): string {
		const fields = skipEmptyArguments(this.publicSources, this.privateSources, this.interfaceSources);
		const res = "\n" + fields.map(f => f.toString({intendationSize: 4, multiline: true})).join("\n\n");
		return `${TargetSources.functionName}(${this.target}${res})\n`;
	}
}
