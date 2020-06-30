import chalk from 'chalk';
import debug from 'debug';
import http from 'http';
import app from './server';
import { PORT } from './config/envVariables';
import Notif from './services/Notification';

const log = debug('dev');

const port = PORT || 4000;
const server = http.createServer(app);
const Notification = new Notif(server);

Notification.start();

server.listen(port, () => {
  log(`Server is running on port ${chalk.yellow(port)}`);
});

export default { app, Notification };
