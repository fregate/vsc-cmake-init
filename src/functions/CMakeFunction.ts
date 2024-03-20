import CMakeUnit from "./CMakeUnit";

export default class CMakeFunction implements CMakeUnit {
	protected name: string;

	constructor(name: string) {
		this.name = name;
	}
}
