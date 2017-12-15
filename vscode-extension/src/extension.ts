'use strict';
import * as vscode from 'vscode';
import { normalize } from 'path';
import * as child_process from 'child_process';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('Lightroom Utils')

    let disposable = vscode.commands.registerCommand('extension.reloadLightroomPlugins', () => {
        // Check if system is windows
        if (!/^win/.test(process.platform)) {
            vscode.window.showErrorMessage('The lightroom-plugin-utils extension only supports Windows systems');
            return;
        }

        // Clear output window
        outputChannel.clear();

        // Launch launcher (that reloads all Lightroom plugins)
        const extensionPath = normalize(vscode.extensions.getExtension('jusonex.lightroom-plugin-utils').extensionPath);
        const launcherProcess = child_process.execFile(`${extensionPath}/../bin/release/launcher.exe`);
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
