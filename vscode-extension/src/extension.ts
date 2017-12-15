'use strict';
import * as vscode from 'vscode';
import { normalize } from 'path';
import * as child_process from 'child_process';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('Lightroom Utils')

    let disposable = vscode.commands.registerCommand('extension.reloadLightroomPlugins', () => {
        outputChannel.clear();

        const extensionPath = normalize(vscode.extensions.getExtension('jusonex.lightroom-plugin-utils').extensionPath);
        const process = child_process.execFile(`${extensionPath}/../bin/release/launcher.exe`);
        process.stdout.on('data', data => {
            outputChannel.appendLine(data.toString());
            outputChannel.show(true);
        });
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
