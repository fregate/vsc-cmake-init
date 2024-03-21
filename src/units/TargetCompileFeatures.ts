import ArgumentPair, { skipEmptyArguments } from "./ArgumentPair";
import CMakeUnit from "./CMakeUnit";

export class TargetCompileFeaturesOptions {
	publicFeatures?: string[];
	privateFeatures?: string[];
	interfaceFeatures?: string[];

	public check(): void {
		if (!this.publicFeatures && !this.privateFeatures && ! this.interfaceFeatures) { throw new Error("Invalid TargetCompileFeaturesOptions. Has to contain at least one feature"); }
		if (this.interfaceFeatures && (this.privateFeatures || this.publicFeatures)) { throw new Error("Invalid TargetCompileFeaturesOptions. INTERFACE features can't combine with PUBLIC or PRIVATE features"); }
	}
}

export default class TargetCompileFeatures implements CMakeUnit {
	private target: ArgumentPair;
	private publicFeatures?: ArgumentPair;
	private privateFeatures?: ArgumentPair;
	private interfaceFeatures?: ArgumentPair;

	private static readonly functionName: string = "target_compile_features";

	constructor(targetName: string, options?: TargetCompileFeaturesOptions) {
		options?.check(); //  check if options properly filled

		this.target = new ArgumentPair(targetName);
		if (options?.publicFeatures) { this.publicFeatures = new ArgumentPair("PUBLIC", ...options.publicFeatures); }
		if (options?.privateFeatures) { this.privateFeatures = new ArgumentPair("PRIVATE", ...options.privateFeatures); }
		if (options?.interfaceFeatures) { this.interfaceFeatures = new ArgumentPair("INTERFACE", ...options.interfaceFeatures); }
	}

	public toString(): string {
		const fields = skipEmptyArguments(this.publicFeatures, this.privateFeatures, this.interfaceFeatures);
		const res = "\n" + fields.map(f => f.toString({intendationSize: 4})).join("\n");
		return `${TargetCompileFeatures.functionName}(${this.target.toString()}\n${res})\n`;
	}
}
