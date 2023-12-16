import EventEmitter from 'events';
import readline from 'readline';
import Client from 'ssh2-sftp-client';
import { initLogger } from '../logger';
import { TLogReaderFTPOptions } from '../types';
import { parseLine } from './parsers/index';

export const ftpReader = (
  options: TLogReaderFTPOptions,
  emitter: EventEmitter,
  logger: ReturnType<typeof initLogger>,
) => {
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
      let lastSize = (await sftp.stat(remoteFilePath)).size;
      let canStart = true;

      emitter.emit('connected');
      logger.log('Connected to FTP server');

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
      logger.error('FTP connection lost');
      logger.error(error);

      setTimeout(() => {
        logger.log('Reconnect to FTP');

        ftpReader(options, emitter, logger);
      }, 10000);
    });
};
