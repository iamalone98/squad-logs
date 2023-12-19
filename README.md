# SquadLogs

This library is designed for the game Squad, it will give you the ability to easily parse game logs. It is possible to read the file locally or protocol SFTP. I hope this will be useful to you!

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the

```console
$ npm install squad-logs
```

or

```console
$ yarn add squad-logs
```

## Quick Start

### SFTP

```typescript
import { LogsReader } from 'squad-logs';

(async () => {
  const logsReader = LogsReader({
    id: 1,
    autoReconnect: true,
    readType: 'remote',
    adminsFilePath: '/SquadGame/ServerConfig/Admins.cfg',
    filePath: '/SquadGame/Saved/Logs/SquadGame.log',
    host: '127.0.0.1',
    username: 'root',
    password: '123456',
  });

  await logsReader.init();

  const admins = await logsReader.getAdminsFile();

  logsReader.on('PLAYER_CONNECTED', (data) => {
    console.log(data);
  });
})();
```

### LOCAL

```typescript
import { LogsReader } from 'squad-logs';

(async () => {
  const logsReader = LogsReader({
    id: 1,
    autoReconnect: true,
    readType: 'local',
    adminsFilePath: '/SquadGame/ServerConfig/Admins.cfg',
    filePath: '/SquadGame/Saved/Logs/SquadGame.log',
  });

  await logsReader.init();

  const admins = await logsReader.getAdminsFile();

  logsReader.on('PLAYER_CONNECTED', (data) => {
    console.log(data);
  });
})();
```

### Events

| Event                   | Return       | Type                  |
| ----------------------- | ------------ | --------------------- |
| **ADMIN_BROADCAST**     | **response** | `TAdminBroadcast`     |
| **DEPLOYABLE_DAMAGED**  | **response** | `TDeployableDamaged`  |
| **NEW_GAME**            | **response** | `TNewGame`            |
| **PLAYER_CONNECTED**    | **response** | `TPlayerConnected`    |
| **PLAYER_DISCONNECTED** | **response** | `TPlayerDisconnected` |
| **PLAYER_DAMAGED**      | **response** | `TPlayerDamaged`      |
| **PLAYER_DIED**         | **response** | `TPlayerDied`         |
| **PLAYER_POSSESS**      | **response** | `TPlayerPossess`      |
| **PLAYER_UNPOSSESS**    | **response** | `TPlayerUnpossess`    |
| **PLAYER_REVIVED**      | **response** | `TPlayerRevived`      |
| **PLAYER_SUICIDE**      | **response** | `TPlayerSuicide`      |
| **PLAYER_WOUNDED**      | **response** | `TPlayerWounded`      |
| **ROUND_WINNER**        | **response** | `TRoundWinner`        |
| **ROUND_ENDED**         | **response** | `TRoundEnded`         |
| **ROUND_TICKETS**       | **response** | `TRoundTickets`       |
| **SQUAD_CREATED**       | **response** | `TSquadCreated`       |
| **VEHICLE_DAMAGED**     | **response** | `TVehicleDamaged`     |
| **connected**           | null         | null                  |
| **close**               | null         | null                  |
