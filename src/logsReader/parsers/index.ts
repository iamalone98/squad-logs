import EventEmitter from 'events';
import { adminBroadcast } from './adminBroadcast';
import { deployableDamaged } from './deployableDamaged';
import { newGame } from './newGame';
import { playerConnected } from './playerConnected';
import { playerDamaged } from './playerDamaged';
import { playerDied } from './playerDied';
import { playerDisconnected } from './playerDisconnected';
import { playerPossess } from './playerPossess';
import { playerRevived } from './playerRevived';
import { playerSuicide } from './playerSuicide';
import { playerUnpossess } from './playerUnpossess';
import { playerWounded } from './playerWounded';
import { roundEnded } from './roundEnded';
import { roundTickets } from './roundTickets';
import { roundWinner } from './roundWinner';
import { serverTickRate } from './serverTickRate';
import { squadCreated } from './squadCreated';
import { vehicleDamaged } from './vehicleDamaged';
import { applyExplosiveDamage } from './applyExplosiveDamage';

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
  playerDamaged,
  playerSuicide,
  deployableDamaged,
  roundEnded,
  roundTickets,
  roundWinner,
  squadCreated,
  vehicleDamaged,
  serverTickRate,
  applyExplosiveDamage
];

export const parseLine = (line: string, emitter: EventEmitter) => {
  for (let i = 0; i < parsers.length; i++) {
    const result = parsers[i](line);

    if (result) {
      emitter.emit(result.event, result);

      break;
    }
  }
};
