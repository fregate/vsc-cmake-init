import ArgumentPair, { filterEmptyArguments } from "./ArgumentPair";
import CMakeUnit from "./CMakeUnit";

interface TargetCompileFeaturesOptions {
	publicFeatures?: string[];
	privateFeatures?: string[];
	interfaceFeatures?: string[];
}

function checkOptions(o?: TargetCompileFeaturesOptions): void {
	if (!o?.publicFeatures && !o?.privateFeatures && ! o?.interfaceFeatures) { throw new Error("Invalid TargetCompileFeaturesOptions. Has to contain at least one feature"); }
	if (o?.interfaceFeatures && (o?.privateFeatures || o?.publicFeatures)) { throw new Error("Invalid TargetCompileFeaturesOptions. INTERFACE features can't combine with PUBLIC or PRIVATE features"); }
}

export default class TargetCompileFeatures implements CMakeUnit {
	private target: ArgumentPair;
	private publicFeatures?: ArgumentPair;
	private privateFeatures?: ArgumentPair;
	private interfaceFeatures?: ArgumentPair;

	private static readonly functionName: string = "target_compile_features";

	constructor(targetName: string, options?: TargetCompileFeaturesOptions) {
		checkOptions(options); //  check if options properly filled

		this.target = new ArgumentPair(targetName);
		if (options?.publicFeatures) { this.publicFeatures = new ArgumentPair("PUBLIC", ...options.publicFeatures); }
		if (options?.privateFeatures) { this.privateFeatures = new ArgumentPair("PRIVATE", ...options.privateFeatures); }
		if (options?.interfaceFeatures) { this.interfaceFeatures = new ArgumentPair("INTERFACE", ...options.interfaceFeatures); }
	}

	public toString(): string {
		const fields = filterEmptyArguments(this.publicFeatures, this.privateFeatures, this.interfaceFeatures);
		const split = fields.length > 1 ? "\n" : " ";
		const res = fields.map(f => f.toString({intendationSize: fields.length > 1 ? 4 : 0})).join("\n");
		return `${TargetCompileFeatures.functionName}(${this.target}${split}${res})\n`;
	}
}
