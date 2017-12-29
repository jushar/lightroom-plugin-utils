import * as vscode from 'vscode';
import { join } from 'path';
import { TestManager, Test, TestState } from './TestManager';

class TestNode {
  constructor(public name: string, public tests?: Test[], public state?: TestState) {}
}

export class TestTreeDataProvider implements vscode.TreeDataProvider<TestNode> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TestNode>();
  public readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private context: vscode.ExtensionContext, private testManager: TestManager) {
    context.subscriptions.push(this._onDidChangeTreeData);
  }

  getTreeItem(node: TestNode): vscode.TreeItem {
    let collapsibleState = vscode.TreeItemCollapsibleState.None;
    if (node.tests) {
      collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    }

    let iconPath = null;
    if (node.state === TestState.Succeeded) {
      iconPath = this.context.asAbsolutePath(join('resources', 'success.svg'));
    } else if (node.state === TestState.Failed) {
      iconPath = this.context.asAbsolutePath(join('resources', 'failed.svg'));
    }

    return {
      label: node.name,
      collapsibleState: collapsibleState,
      iconPath: iconPath
    };
  }

  getChildren(element?: TestNode): TestNode[] | Thenable<TestNode[]> {
    // Are we retrieving the root node?
    if (!element) {
      return this.testManager.TestSuites.map(suite => new TestNode(suite.name, suite.tests));
    }

    return element.tests.map(test => new TestNode(test.name, null, test.state ));
  }

  update() {
    this._onDidChangeTreeData.fire();
  }
}
