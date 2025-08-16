import { LogsReaderEvents } from '../../events';
import { TNotifyAcceptingConnection } from '../../types';

export const notifyAcceptingConnection = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogNet: NotifyAcceptingConnection accepted from: (\d{1,3}(?:\.\d{1,3}){3}):(\d+)$/,
  );

  if (matches) {
    const data: TNotifyAcceptingConnection = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      ip: matches[3],
      port: matches[4],
      event: LogsReaderEvents.PLAYER_ACCEPTING_CONNECTION,
    };

    return data;
  }

  return null;
};
