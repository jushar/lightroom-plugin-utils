import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as vscode from 'vscode';

export function createAPI(outputChannel: vscode.OutputChannel) {
  const server = express();
  server.use(bodyParser.json());

  server.post('/log_message', (req, res) => {
    if (!req.body || typeof req.body.message !== 'string') {
      return res.sendStatus(400);
    }

    outputChannel.appendLine(req.body.message);
    res.json(req.body);
  });

  server.listen(5864);
}
