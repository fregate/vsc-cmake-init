export default function wrapVariable(v: string): string {
	return `\${${v}}`;
}
