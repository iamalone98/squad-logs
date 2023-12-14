import EventEmitter from 'events';
import { adminBroadcast } from './adminBroadcast';
import { newGame } from './newGame';
import { playerConnected } from './playerConnected';
import { playerDied } from './playerDied';
import { playerDisconnected } from './playerDisconnected';
import { playerPossess } from './playerPossess';
import { playerRevived } from './playerRevived';
import { playerUnpossess } from './playerUnpossess';
import { playerWounded } from './playerWounded';
import { deployableDamaged } from './deployableDamaged';
import { playerDamaged } from './playerDamaged';
import { playerSuicide } from './playerSuicide';
import { roundEnded } from './roundEnded';
import { roundTickets } from './roundTickets';
import { roundWinner } from './roundWinner';
import { squadCreated } from './squadCreated';
import { vehicleDamaged } from './vehicleDamaged';

const parsers = [
  adminBroadcast,
  newGame,
  playerConnected,
  playerDisconnected,
  playerRevived,
  playerWounded,
  playerDied,
  playerPossess,
  playerUnpossess,
  deployableDamaged,
  playerDamaged,
  playerSuicide,
  roundEnded,
  roundTickets,
  roundWinner,
  squadCreated,
  vehicleDamaged
];

export const parseLine = (line: string, emitter: EventEmitter) => {
  parsers.forEach((f) => {
    const result = f(line);

    if (result) {
      emitter.emit(result.event, result);
    }
  });
};
