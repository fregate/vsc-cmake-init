import { provideVSCodeDesignSystem, vsCodeButton } from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeButton());

const vscode = acquireVsCodeApi();

function generateTargetName(projectName: string) {
	if (!projectName) { return; }
	if (projectName.length === 0) { return; }
	const ww = projectName.split(" ");
	let target = document.getElementById("text-target-name") as HTMLInputElement;
	if (ww.length === 1) { target.value = projectName.at(0)!.toLocaleLowerCase() + projectName.slice(1); return; }
	ww[0] = ww[0].toLocaleLowerCase();
	target.value = ww.join("");
};

export function sendError(error: string) {
	vscode.postMessage({
		command: "error",
		error: error
	});
};

window.onload = () => {
	generateTargetName((document.getElementById("text-project-name") as HTMLInputElement).value);

	document.getElementById("btn-create-project")!.addEventListener("click",
		() => {
			// gather all fields to object
			const projectName = (document.getElementById("text-project-name") as HTMLInputElement).value;
			if (projectName === null || projectName.length === 0) { sendError("Project Name required!"); return; }

			const targetName = (document.getElementById("text-target-name") as HTMLInputElement).value;
			if (targetName === null || targetName.length === 0) { sendError("Target Name required!"); return; }

			const projectDescription = (document.getElementById("text-project-desc") as HTMLInputElement).value;
			const compilerOptions = (document.getElementById("text-compiler-options") as HTMLInputElement).value;

			const cppStandart = (document.getElementById("select-cpp-standart") as HTMLSelectElement).value;
			if (cppStandart === null || cppStandart.length === 0) { sendError("Invalid cpp standart!"); return; }

			vscode.postMessage({
				command: "create",
				projectName: projectName,
				targetName: targetName,
				description: projectDescription,
				compilerOptions: compilerOptions,
				cppStandart: cppStandart
			});
		}
	);

	document.getElementById("text-project-name")!.addEventListener("input", (e: Event) => {
		generateTargetName((e.currentTarget as HTMLInputElement).value);
	});
};