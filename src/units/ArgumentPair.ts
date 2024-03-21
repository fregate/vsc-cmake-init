export interface ArgumentPairFormat {
	multiline?: boolean;
	intendationSize?: number;
	quotation?: boolean;
}

export function qouteString(s: string): string {
	return `"${s}"`;
}

export default class ArgumentPair {
	private name: string;
	private values: Set<string> | undefined = undefined;

	constructor(name: string, ...values: string[]) {
		this.name = name;
		if (values.length) {
			this.values = new Set(values);
		}
	}

	private getValue(): string | undefined {
		if (!this.values) { return this.values; }
		return this.values.values().next().value;
	}

	private formatValue(v: string, options?: ArgumentPairFormat): string {
		return (options?.quotation || v.includes(" ")) ? qouteString(v) : v;
	}

	public toString(options?: ArgumentPairFormat): string {
		if (!this.values) {
			return this.formatValue(this.name, options);
		}

		const intendation = options?.intendationSize ? " ".repeat(options.intendationSize) : "";
		let res = intendation + this.name;
		this.values.forEach(v => 
			res += (options?.multiline ? "\n" + intendation + intendation : " ") + this.formatValue(v, options));
		return res;
	}
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

export function filterEmptyArguments(...args: (ArgumentPair | null | undefined)[]): ArgumentPair[] {
	return args.filter(notEmpty);
}
