import EventEmitter from 'events';
import readline from 'readline';
import Client from 'ssh2-sftp-client';
import { logger } from '../logger';
import { TLogReaderFTPOptions } from '../types';
import { parseLine } from './parsers/index';

let isReaderWorking = false;
let timer: NodeJS.Timeout;

export const ftpReader = (
  options: TLogReaderFTPOptions,
  emitter: EventEmitter,
) => {
  clearTimeout(timer);

  if (!isReaderWorking) {
    const { host, password, username, remoteFilePath } = options;
    const sftp = new Client();

    sftp
      .connect({
        port: 22,
        host,
        username,
        password,
      })
      .then(async () => {
        isReaderWorking = true;
        logger.log('Connected to FTP server');

        let lastSize = (await sftp.stat(remoteFilePath)).size;
        let canStart = true;

        for (;;) {
          const { size } = await sftp.stat(remoteFilePath);
          if (canStart && lastSize != size) {
            canStart = false;

            const stream = sftp.createReadStream(remoteFilePath, {
              start: lastSize,
            });

            const rl = readline.createInterface({
              input: stream,
              crlfDelay: Infinity,
            });

            rl.on('line', (line: string) => {
              parseLine(line, emitter);
            });

            rl.on('close', () => {
              lastSize = size;
              canStart = true;
            });
          }
        }
      })
      .catch((error) => {
        isReaderWorking = false;
        logger.error('FTP connection lost');
        logger.error(error);

        timer = setTimeout(() => {
          logger.log('Reconnect to FTP');

          ftpReader(options, emitter);
        }, 30000);
      });
  }
};
