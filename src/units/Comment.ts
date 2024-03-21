import CMakeUnit from "./CMakeUnit";

export default class Comment implements CMakeUnit {
	private comment: string;

	constructor(comment: string) {
		this.comment = comment;
	}

	public toString(): string {
		return `#${this.comment.length ? ` ${this.comment}` : this.comment}\n`;
	}
}
