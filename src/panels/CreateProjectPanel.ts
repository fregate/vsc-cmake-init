import * as vscode from 'vscode';
import ProjectConfigurationInterface from './ProjectConfigurationInterface';
import CMakeMinimumRequired from '../units/CMakeMinimumRequired';
import Project from '../units/Project';
import CMakeUnit from '../units/CMakeUnit';
import emptyLine from '../units/EmptyLine';
import TargetCompileFeatures from '../units/TargetCompileFeatures';
import { AddLibrary, LibraryType } from '../units/AddLibrary';
import { AddExecutable } from '../units/AddExecutable';
import SetVariable from '../units/SetVariable';
import TargetSources from '../units/TargetSources';
import wrapVariable from '../units/WrapVariable';
import Comment from '../units/Comment';
import TargetIncludeDirectories from '../units/TargetIncludeDirectories';
import TargetLinkLibraries from '../units/TargetLinkLibraries';
import { getNonce } from '../utilities/getNonce';
import { getUri } from '../utilities/getUri';

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,

		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [ vscode.Uri.joinPath(extensionUri, 'out') ]
	};
}

export default class CreateProjectPanel {
	public static currentPanel: CreateProjectPanel | undefined;

	public static readonly viewType = 'initProject';

	private readonly panel: vscode.WebviewPanel;
	private readonly extensionUri: vscode.Uri;
	private disposables: vscode.Disposable[] = [];

	public static render(extensionUri: vscode.Uri) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (CreateProjectPanel.currentPanel) {
			CreateProjectPanel.currentPanel.panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			CreateProjectPanel.viewType,
			'Create New CMake Project',
			column || vscode.ViewColumn.One,
			getWebviewOptions(extensionUri),
		);

		CreateProjectPanel.currentPanel = new CreateProjectPanel(panel, extensionUri);
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		CreateProjectPanel.currentPanel = new CreateProjectPanel(panel, extensionUri);
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this.panel = panel;
		this.extensionUri = extensionUri;

		// Set the webview's initial html content
		this.update();

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programmatically
		this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

		// Update the content based on view changes
		this.panel.onDidChangeViewState(
			e => {
				if (this.panel.visible) {
					this.update();
				}
			},
			null,
			this.disposables
		);

		// Handle messages from the webview
		this.panel.webview.onDidReceiveMessage(
			message => {
				switch(message.command) {
					case "error":
						this.onError(message.error);
						break;
					case "create":
						this.onCreate(message);
						break;
				}
			},
			null,
			this.disposables
		);
	}

	private onError(description: string) {
		vscode.window.showErrorMessage("Error in configuration", { modal: true, detail: description });
	}

	private async onCreate(message: ProjectConfigurationInterface) {
		const project = new Project(message.projectName, {
				description: message.description, languages: ["CXX"], version: "0.1.0"}
			);

		const lib = new AddLibrary(message.outputName, { type: LibraryType.static });
		const exe = new AddExecutable(message.outputName);

		const targetName = "LIB_NAME";
		const set = new SetVariable(targetName, message.outputName);

		const std = new TargetCompileFeatures(wrapVariable(targetName), { publicFeatures: [message.cppStandart] });
		const sources = new TargetSources(wrapVariable(targetName),
			{
				publicSources: ["src/main.cpp", "src/utils.cpp"],
				privateSources: ["src/utils.h"]
			});

		const includes = new TargetIncludeDirectories(wrapVariable(targetName),
			{
				publicIncludes: ["include"],
			});


		const libs = new TargetLinkLibraries(wrapVariable(targetName),
			{
				publicLibraries: ["Erlang::EI", "Erlang::Erlang"],
			});

		// create CMakeLists.txt inplace
		let cmakePathOnDisk: vscode.Uri;

		// TODO: check if CMakeLists.txt already exists in a folder. Show error if present.
		const folders = vscode.workspace.workspaceFolders;
		if (folders && folders !== undefined) {
			if (folders.length > 1) {
				// choose folder to create in
				// TODO remove. (it is hack for remove linter error)
				cmakePathOnDisk = vscode.Uri.joinPath(folders[0].uri, 'CMakeLists.txt');
			} else {
				cmakePathOnDisk = vscode.Uri.joinPath(folders[0].uri, 'CMakeLists.txt');
			}
		} else {
			const folder = await vscode.window.showOpenDialog({canSelectFiles: false, canSelectFolders: true, canSelectMany: false, title: "Select folder to save project"});
			if (!folder) { return; }

			cmakePathOnDisk = vscode.Uri.joinPath(folder[0], 'CMakeLists.txt');
		}

		this.write(cmakePathOnDisk,
				[new CMakeMinimumRequired("3.20"),
				emptyLine,
				new Comment("This file generated by VSCode CMake Init extension"),
				emptyLine,
				project,
				emptyLine,
				lib,
				emptyLine,
				set, emptyLine,
				std,
				emptyLine,
				exe,
				emptyLine,
				sources,
				includes,
				libs,
			])
			.then(() => this.dispose()); // close configuration panel
	}

	private write(pathOnDisk: vscode.Uri, content: CMakeUnit[]): Thenable<void> {
		return vscode.workspace.fs.writeFile(pathOnDisk, Buffer.from(""))
			.then(() => vscode.workspace.openTextDocument(pathOnDisk))
			.then(doc => vscode.window.showTextDocument(doc))
			.then(async editor => {
				await editor.edit(builder =>
						content.forEach(c =>
								builder.insert(new vscode.Position(editor.document.lineCount, 0), c.toString()))
				).then(() => editor.document.save());
			});
	}

	private async update() {
		const webview = this.panel.webview;
		this.panel.webview.html = await this.getHtmlForWebview(webview);
	}

	public dispose() {
		CreateProjectPanel.currentPanel = undefined;

		// Clean up our resources
		this.panel.dispose();
		while (this.disposables.length) {
			const x = this.disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private async getHtmlForWebview(webview: vscode.Webview) {
		const stylesUri = getUri(webview, this.extensionUri, ['out', 'styles.css']);
		const scriptUri = getUri(webview, this.extensionUri, ['out', 'webview.js']);
		const nonce = getNonce();

		// Read template
		const htmlPath = vscode.Uri.joinPath(this.extensionUri, 'out', 'configuration.html');
		const html = await vscode.workspace.fs.readFile(htmlPath);

		return eval("`" + html.toString() + "`");
	}
}
