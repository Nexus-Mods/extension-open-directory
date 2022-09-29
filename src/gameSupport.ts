import * as path from 'path';
import * as Redux from 'redux';
import { selectors, types, util } from 'vortex-api';

interface IGameSupport {
  settingsPath?: () => string;
  appDataPath?: () => string;
}

const localAppData: () => string = (() => {
  let cached: string;
  return () => {
    if (cached === undefined) {
      cached = process.env.LOCALAPPDATA
        || path.resolve(util.getVortexPath('appData'), '..', 'Local');
    }
    return cached;
  };
})();

const gameSupportXboxPass: { [gameId: string]: IGameSupport } = {
  skyrimse: {
    settingsPath: () => path.join(util.getVortexPath('documents'), 'My Games', 'Skyrim Special Edition MS'),
    appDataPath: () => path.join(localAppData(), 'Skyrim Special Edition MS'),
  },
  fallout4: {
    settingsPath: () => path.join(util.getVortexPath('documents'), 'My Games', 'Fallout4 MS'),
    appDataPath: () => path.join(localAppData(), 'Fallout4 MS'),
  },
}

const gameSupportGOG: { [gameId: string]: IGameSupport } = {
  skyrimse: {
    settingsPath: () => path.join(util.getVortexPath('documents'), 'My Games', 'Skyrim Special Edition GOG'),
    appDataPath: () => path.join(localAppData(), 'Skyrim Special Edition GOG'),
  },
}

const gameSupport: { [gameId: string]: IGameSupport } = {
  fallout3: {
    settingsPath: () => path.join(util.getVortexPath('documents'), 'My Games', 'Fallout3'),
    appDataPath: () => path.join(localAppData(), 'Fallout3'),
  },
  falloutnv: {
    settingsPath: () => path.join(util.getVortexPath('documents'), 'My Games', 'FalloutNV'),
    appDataPath: () => path.join(localAppData(), 'FalloutNV'),
  },
  fallout4: {
    settingsPath: () => path.join(util.getVortexPath('documents'), 'My Games', 'Fallout4'),
    appDataPath: () => path.join(localAppData(), 'Fallout4'),
  },
  fallout4vr: {
    settingsPath: () => path.join(util.getVortexPath('documents'), 'My Games', 'Fallout4VR'),
    appDataPath: () => path.join(localAppData(), 'Fallout4VR'),
  },
  oblivion: {
    settingsPath: () => path.join(util.getVortexPath('documents'), 'My Games', 'Oblivion'),
    appDataPath: () => path.join(localAppData(), 'Oblivion'),
  },
  skyrim: {
    settingsPath: () => path.join(util.getVortexPath('documents'), 'My Games', 'Skyrim'),
    appDataPath: () => path.join(localAppData(), 'Skyrim'),
  },
  skyrimse: {
    settingsPath: () => path.join(util.getVortexPath('documents'), 'My Games', 'Skyrim Special Edition'),
    appDataPath: () => path.join(localAppData(), 'Skyrim Special Edition'),
  },
  skyrimvr: {
    settingsPath: () => path.join(util.getVortexPath('documents'), 'My Games', 'SkyrimVR'),
    appDataPath: () => path.join(localAppData(), 'SkyrimVR'),
  },
};

function isXboxPath(discoveryPath: string) {
  const hasPathElement = (element) =>
    discoveryPath.toLowerCase().includes(element);
  return ['modifiablewindowsapps', '3275kfvn8vcwc'].find(hasPathElement) !== undefined;
}

let gameStoreForGame: (gameId: string) => string = () => undefined;

export function initGameSupport(store: Redux.Store<types.IState>) {
  const state: types.IState = store.getState();

  gameStoreForGame = (gameId: string) => selectors.discoveryByGame(store.getState(), gameId)['store'];

  const {discovered} = state.settings.gameMode;

  Object.keys(gameSupportXboxPass).forEach(gameMode => {
    if (discovered[gameMode]?.path !== undefined) {
      if (isXboxPath(discovered[gameMode].path)) {
        gameSupport[gameMode] = gameSupportXboxPass[gameMode];
      }
    }
  })
}

export function settingsPath(game: types.IGame): string {
  const knownPath = (gameStoreForGame(game.id) === 'gog')
    ? gameSupportGOG[game.id]?.settingsPath?.()
    : gameSupport[game.id]?.settingsPath?.();
  return (knownPath !== undefined)
    ? knownPath
    : game.details?.settingsPath?.();
}

export function appDataPath(game: types.IGame): string {
  const knownPath = (gameStoreForGame(game.id) === 'gog')
    ? gameSupportGOG[game.id]?.appDataPath?.()
    : gameSupport[game.id]?.appDataPath?.();
  return (knownPath !== undefined)
    ? knownPath
    : game.details?.appDataPath?.();
}
