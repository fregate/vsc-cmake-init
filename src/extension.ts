import * as vscode from 'vscode';
import CreateProjectPanel from './panels/CreateProjectPanel';

export function activate(context: vscode.ExtensionContext) {
	const helloCommand = vscode.commands.registerCommand("cmake-init.initProject", () => {
	  CreateProjectPanel.render(context.extensionUri);
	});
  
	context.subscriptions.push(helloCommand);
  }

export function deactivate() {}
