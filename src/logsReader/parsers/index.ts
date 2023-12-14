import EventEmitter from 'events';
import { playerConnected } from './playerConnected';
import { playerDisconnected } from './playerDisconnected';

const parsers = [playerConnected, playerDisconnected];

export const parseLine = (line: string, emitter: EventEmitter) => {
  parsers.forEach((f) => {
    const result = f(line);

    if (result) {
      emitter.emit(result.event, result);
    }
  });
};
