import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as vscode from 'vscode';
import { TestManager, TestSuite, Test, TestState } from './TestManager';
import { TestTreeDataProvider } from './TestTreeDataProvider';

/**
 * Discovery API type declaration
 */
interface TestDiscovery {
  test_suites: {
   [name: string]: string[]
  };
}

/**
 * Creates the HTTP API
 * @param outputChannel Output channel for logging
 * @param testManager Test manager
 * @param tree TestTreeDataProvider instance
 */
export function createAPI(outputChannel: vscode.OutputChannel, testManager: TestManager, tree: TestTreeDataProvider) {
  const server = express();
  server.use(bodyParser.json());

  server.post('/log_message', (req, res) => {
    if (!req.body || typeof req.body.message !== 'string') {
      return res.sendStatus(400);
    }

    outputChannel.appendLine(req.body.message);
    res.json(req.body);
  });

  server.post('/test_discovery', (req, res) => {
    if (!req.body || !req.body.test_suites) {
      return res.sendStatus(400);
    }

    // Interpret as discovery and convert to suitable data type
    const discovery = req.body as TestDiscovery;
    const testSuites: TestSuite[] = [];
    for (const testName in discovery.test_suites) {
      if (discovery.test_suites.hasOwnProperty(testName)) {
        const tests: string[] = discovery.test_suites[testName];

        testSuites.push({
          name: testName,
          tests: tests.map(name => ({ name: name, state: TestState.Discovered }))
        });
      }
    }

    // Apply test discovery
    testManager.applyDiscovery(testSuites);
    tree.update();

    res.json(testSuites);
  });

  server.post('/test_result', (req, res) => {
    if (!req.body || typeof req.body.test_suite === 'undefined' || typeof req.body.test_name === 'undefined' || typeof req.body.succeeded === 'undefined') {
      return res.sendStatus(400);
    }

    // Apply new test status
    const test = testManager.applyTestStatus(req.body.test_suite, req.body.test_name, req.body.succeeded);
    tree.update();

    res.json(test);
  });

  server.listen(5864);
}
