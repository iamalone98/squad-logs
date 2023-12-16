import EventEmitter from 'events';
import { initLogger } from '../logger';
import {
  TLogReaderFTPOptions,
  TLogReaderLocalOptions,
  TLogReaderOptions,
} from '../types';
import { ftpReader } from './ftpReader';
import { localReader } from './localReader';

export const LogsReader = (options: TLogReaderOptions) => {
  const logsEmitter = new EventEmitter();

  const logger = initLogger(
    options.id,
    typeof options.logEnabled === 'undefined'
      ? true
      : options?.logEnabled,
  );

  if (!options) {
    logger.error('LogReader options is required');
    return logsEmitter;
  }

  if (
    (options as TLogReaderLocalOptions).localFilePath &&
    options.id
  ) {
    const { localFilePath } = options as TLogReaderLocalOptions;

    localReader(localFilePath, logsEmitter, logger);

    return logsEmitter;
  }

  const { host, password, username, remoteFilePath } =
    options as TLogReaderFTPOptions;

  if (host && password && username && remoteFilePath && options.id) {
    ftpReader(options as TLogReaderFTPOptions, logsEmitter, logger);

    return logsEmitter;
  }

  logger.error('LogsReader missed required params');

  return logsEmitter;
};
