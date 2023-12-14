import EventEmitter from 'events';
import readline from 'readline';
import Client from 'ssh2-sftp-client';
import { logger } from '../logger';
import {
  TLogReaderFTPOptions,
  TLogReaderLocalOptions,
  TLogReaderOptions,
} from '../types';
import { parseLine } from './parsers';

export const LogsReader = (options: TLogReaderOptions) => {
  const logsEmitter = new EventEmitter();

  if (!options) {
    logger.error('LogReader options is required');
    return logsEmitter;
  }

  if ((options as TLogReaderLocalOptions).localFilePath) {
    // const { localFilePath } = options as TLogReaderLocalOptions;

    // console.log(localFilePath);

    /* TODO */

    return logsEmitter;
  }

  const { host, password, username, remoteFilePath } =
    options as TLogReaderFTPOptions;

  if (!host || !password || !username || !remoteFilePath) {
    logger.error('LogsReaderFTP missed required params');

    return logsEmitter;
  }

  const sftp = new Client();

  sftp
    .connect({
      port: 22,
      host,
      username,
      password,
    })
    .then(async () => {
      logger.log('Connected to FTP server');

      let lastSize = (await sftp.stat(remoteFilePath)).size;
      let canStart = true;

      for (;;) {
        const { size } = await sftp.stat(remoteFilePath);
        if (canStart && lastSize != size) {
          canStart = false;

          const rl = readline.createInterface({
            input: sftp.createReadStream(remoteFilePath, {
              start: lastSize,
            }),
            crlfDelay: Infinity,
          });

          rl.on('line', (line: string) => {
            parseLine(line, logsEmitter);
          });

          rl.on('close', () => {
            lastSize = size;
            canStart = true;
          });
        }
      }
    })
    .catch((err) => {
      logger.error(err.message);
    });

  return logsEmitter;
};
