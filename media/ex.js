(function () {
    const vscode = acquireVsCodeApi();

	const generateTargetName = (projectName) => {
		if (projectName === null) { return; }
		if (projectName.length === 0) { return; }
		const ww = projectName.split(" ");
		var target = document.getElementById("text-target-name");
		if (ww.length === 1) { target.value = projectName.at(0).toLocaleLowerCase() + projectName.slice(1); return; }
		ww[0] = ww[0].toLocaleLowerCase();
		target.value = ww.join("");
	};

	const sendError = (error) => {
		vscode.postMessage({
			command: "error",
			error: error
		});
	};

	document.getElementById("btn-create-project").addEventListener("click",
			() => {
				// gather all fields to object
				const projectName = document.getElementById("text-project-name").value;
				if (projectName === null || projectName.length === 0) { sendError("Project Name required!"); return; }

				const targetName = document.getElementById("text-target-name").value;
				if (targetName === null || targetName.length === 0) { sendError("Target Name required!"); return; }

				const projectDescription = document.getElementById("text-project-desc").value;
				const compilerOptions = document.getElementById("text-compiler-options").value;

				const cppStandart = document.getElementById("select-cpp-standart").value;
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

	document.getElementById("text-project-name").addEventListener("input", (e) => {
		generateTargetName(e.currentTarget.value);
	});

	window.onload = () => {
		generateTargetName(document.getElementById("text-project-name").value);
	};
}());
