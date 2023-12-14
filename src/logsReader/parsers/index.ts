import EventEmitter from 'events';
import { playerConnected } from './playerConnected';
import { playerDisconnected } from './playerDisconnected';
import { adminBroadcast } from './adminBroadcast';
import { deployableDamaged } from './deployableDamaged';
import { newGame } from './newGame';
import { playerDamaged } from './playerDamaged';
import { playerDied } from './playerDied';
import { playerPossess } from './playerPossess';
import { playerRevived } from './playerRevived';
import { playerSuicide } from './playerSuicide';
import { playerUnpossess } from './playerUnpossess';
import { playerWonded } from './playerWounded';
import { roundEnded } from './roundEnded';
import { roundTickets } from './roundTickets';
import { roundWinner } from './roundWinner';
import { squadCreated } from './squadCreated';
import { vehicleDamaged } from './vehicleDamaged';

const parsers = [
  playerConnected,
  playerDisconnected,
  adminBroadcast,
  deployableDamaged,
  newGame,
  playerDamaged,
  playerDied,
  playerPossess,
  playerRevived,
  playerSuicide,
  playerUnpossess,
  playerWonded,
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
