'use strict';
import * as vscode from 'vscode';
import { normalize } from 'path';
import * as child_process from 'child_process';
import { createAPI } from './api';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  // Create an output channel for log information
  const outputChannel = vscode.window.createOutputChannel('Lightroom Utils')

  // Launch the API
  const config = vscode.workspace.getConfiguration('lrpluginutils');
  if (config.get<boolean>('enableAPI')) {
    createAPI(outputChannel);
  }

  // Register commands
  const disposable = vscode.commands.registerCommand('extension.reloadLightroomPlugins', () => {
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

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
