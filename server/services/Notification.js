import socketIo from 'socket.io';
import debug from 'debug';
const log = debug('dev');

export default class Notification {
  constructor(app) {
    this.io = socketIo(app);
    this.socket = null;
  }

  start() {
    log('Notification class started');
    this.io.on('connection', (socket) => {
      log('connected successfully');
      this.socket = socket;
    });

    this.io.on('disconnect', () => {
      log('user disconnected');
    });
  }

  trigger(id) {
    if (!this.socket) {
      throw new Error('Socket not connected. Please start socket connection');
    }
    this.socket.emit(`paxinfy-notif-${id}`, 'get-notification');
  }
}

/**
 * Front end code
 *  const ENDPOINT = 'http://127.0.0.1:2019';
  import socketIOClient from 'socket.io-client';
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on('paxinfy-notif-12', (data) => {
      log('====================================');
      log(data);
      log('====================================')
    });
  }, []);
 */
