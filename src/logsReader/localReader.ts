import EventEmitter from 'events';
import { Tail } from 'tail';
import { logger } from '../logger';
import { parseLine } from './parsers/index';

let isReaderWorking = false;
let timer: NodeJS.Timeout;

export const localReader = (path: string, emitter: EventEmitter) => {
  clearTimeout(timer);

  if (!isReaderWorking) {
    try {
      const tail = new Tail(path);

      isReaderWorking = true;
      logger.log('Connected');
      emitter.emit('connected');

      tail.on('line', function (data) {
        parseLine(data, emitter);
      });
    } catch (error) {
      isReaderWorking = false;
      logger.error('Connection lost');
      logger.error(error as string);

      timer = setTimeout(() => {
        logger.log('Reconnect');

        localReader(path, emitter);
      }, 1000);
    }
  }
};
