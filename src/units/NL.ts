import CMakeUnit from "./CMakeUnit";

class NewLine implements CMakeUnit {
	public toString(): string {
		return "\n";
	}
}

const NL = new NewLine;
export default NL;
