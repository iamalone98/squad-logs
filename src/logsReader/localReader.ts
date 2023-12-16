import EventEmitter from 'events';
import { Tail } from 'tail';
import { logger } from '../logger';
import { parseLine } from './parsers/index';

export const localReader = (path: string, emitter: EventEmitter) => {
  try {
    const tail = new Tail(path);

    logger.log('Connected');
    emitter.emit('connected');

    tail.on('line', function (data) {
      parseLine(data, emitter);
    });
  } catch (error) {
    logger.error('Connection lost');
    logger.error(error as string);

    setTimeout(() => {
      logger.log('Reconnect');

      localReader(path, emitter);
    }, 5000);
  }
};
