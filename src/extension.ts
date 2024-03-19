import * as vscode from 'vscode';
import CreateProjectPanel from './CreateProjectPanel';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('cmake-init.initProject',
		() => {
			// const projectName = await vscode.window.showInputBox({
			// 	title: "Input Project Name"
			// });
			// console.log(projectName);
			CreateProjectPanel.createOrShow(context.extensionUri);
		}));
}

export function deactivate() {}
