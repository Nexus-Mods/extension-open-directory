import { app as appIn, remote } from 'electron';
import * as path from 'path';

const app = remote?.app || appIn;

interface IGameSupport {
  settingsPath?: () => string;
  appDataPath?: () => string;
}

const localAppData: () => string = (() => {
  let cached: string;
  return () => {
    if (cached === undefined) {
      cached = process.env.LOCALAPPDATA
        || path.resolve(app.getPath('appData'), '..', 'Local');
    }
    return cached;
  };
})();

const gameSupport: { [gameId: string]: IGameSupport } = {
  fallout3: {
    settingsPath: () => path.join(app.getPath('documents'), 'My Games', 'Fallout3'),
    appDataPath: () => path.join(localAppData(), 'Fallout3'),
  },
  falloutnv: {
    settingsPath: () => path.join(app.getPath('documents'), 'My Games', 'FalloutNV'),
    appDataPath: () => path.join(localAppData(), 'FalloutNV'),
  },
  fallout4: {
    settingsPath: () => path.join(app.getPath('documents'), 'My Games', 'Fallout4'),
    appDataPath: () => path.join(localAppData(), 'Fallout4'),
  },
  fallout4vr: {
    settingsPath: () => path.join(app.getPath('documents'), 'My Games', 'Fallout4VR'),
    appDataPath: () => path.join(localAppData(), 'Fallout4VR'),
  },
  oblivion: {
    settingsPath: () => path.join(app.getPath('documents'), 'My Games', 'Oblivion'),
    appDataPath: () => path.join(localAppData(), 'Oblivion'),
  },
  skyrim: {
    settingsPath: () => path.join(app.getPath('documents'), 'My Games', 'Skyrim'),
    appDataPath: () => path.join(localAppData(), 'Skyrim'),
  },
  skyrimse: {
    settingsPath: () => path.join(app.getPath('documents'), 'My Games', 'Skyrim Special Edition'),
    appDataPath: () => path.join(localAppData(), 'Skyrim Special Edition'),
  },
  skyrimvr: {
    settingsPath: () => path.join(app.getPath('documents'), 'My Games', 'SkyrimVR'),
    appDataPath: () => path.join(localAppData(), 'SkyrimVR'),
  },
};

export function settingsPath(gameMode: string): string {
  return gameSupport[gameMode]?.settingsPath?.();
}

export function appDataPath(gameMode: string): string {
  return gameSupport[gameMode]?.appDataPath?.();
}
