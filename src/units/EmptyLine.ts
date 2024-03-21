import CMakeUnit from "./CMakeUnit";

class EmptyLine implements CMakeUnit {
	public toString(): string {
		return "\n";
	}
}

const emptyLine = new EmptyLine;
export default emptyLine;
