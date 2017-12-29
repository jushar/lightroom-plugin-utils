'use strict';
import * as vscode from 'vscode';
import { normalize } from 'path';
import * as child_process from 'child_process';
import { createAPI } from './api';
import { TestTreeDataProvider } from './TestTreeDataProvider';
import { TestManager } from './TestManager';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  // Create an output channel for log information
  const outputChannel = vscode.window.createOutputChannel('Lightroom Utils')

  // Launch the API
  const config = vscode.workspace.getConfiguration('lrpluginutils');
  if (config.get<boolean>('enableAPI')) {
    const testManager = new TestManager();

    // Register test explorer tree provider
    const treeDataProvider = new TestTreeDataProvider(context, testManager);
    const disposable = vscode.window.registerTreeDataProvider('lightroomPluginUtilsExplorer', treeDataProvider);
    context.subscriptions.push(disposable);

    createAPI(outputChannel, testManager, treeDataProvider);
  }

  // Register commands
  const reloadCommand = vscode.commands.registerCommand('extension.reloadLightroomPlugins', () => {
    // Check if system is windows
    if (!/^win/.test(process.platform)) {
      vscode.window.showErrorMessage('The lightroom-plugin-utils extension only supports Windows systems');
      return;
    }

    // Clear output window
    outputChannel.clear();

    // Launch launcher (that reloads all Lightroom plugins)
    const extensionPath = normalize(vscode.extensions.getExtension('jusonex.lightroom-plugin-utils').extensionPath);
    const launcherProcess = child_process.execFile(`${extensionPath}/launcher.exe`);
    launcherProcess.stdout.on('data', data => {
      outputChannel.appendLine(data.toString());
      outputChannel.show(true);
    });
  });

  context.subscriptions.push(reloadCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
