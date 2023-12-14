import EventEmitter from 'events';
import { logger } from '../logger';
import {
  TLogReaderFTPOptions,
  TLogReaderLocalOptions,
  TLogReaderOptions,
} from '../types';
import { ftpReader } from './ftpReader';
import { localReader } from './localReader';

export const LogsReader = (options: TLogReaderOptions) => {
  const logsEmitter = new EventEmitter();

  if (!options) {
    logger.error('LogReader options is required');
    return logsEmitter;
  }

  if ((options as TLogReaderLocalOptions).localFilePath) {
    const { localFilePath } = options as TLogReaderLocalOptions;

    localReader(localFilePath, logsEmitter);

    return logsEmitter;
  }

  const { host, password, username, remoteFilePath } =
    options as TLogReaderFTPOptions;

  if (host && password && username && remoteFilePath) {
    ftpReader(options as TLogReaderFTPOptions, logsEmitter);

    return logsEmitter;
  }

  logger.error('LogsReader missed required params');

  return logsEmitter;
};
