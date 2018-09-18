import * as path from 'path';
import * as Promise from 'bluebird';
import { fs, selectors, types, util } from 'vortex-api';

function init(context: types.IExtensionContext) {
  context.registerAction('mod-icons', 300, 'open-ext', {},
                         'Open Vortex Mods Folder', () => {
    const store = context.api.store;
    (util as any).opn(selectors.installPath(store.getState())).catch(err => undefined);
  });

  context.registerAction('mod-icons', 300, 'open-ext', {},
                         'Open Game Folder', () => {
    const state = context.api.store.getState();
    const gameId: string = selectors.activeGameId(state);
    getGameInstallPath(state, gameId).then((installPath) => {
      openPath(installPath);
    }).catch(e => null);
  });

  context.registerAction('mod-icons', 300, 'open-ext', {},
                         'Open Game Mods Folder', () => {
    const state = context.api.store.getState();
    const gameRef: types.IGame = util.getGame(selectors.activeGameId(state));
    getGameInstallPath(state, gameRef).then((installPath) => {
      const modPath = path.join(installPath, gameRef.queryModPath(installPath));
      openPath(modPath, installPath);
    }).catch(e => null);
  });
  
  context.registerAction('mods-action-icons', 100, 'open-ext', {},
                         'Open in File Manager', (instanceIds: string[]) => {
    const store = context.api.store;
    const installPath = selectors.installPath(store.getState());
    const modPath = path.join(installPath, instanceIds[0]);
    openPath(modPath, installPath);
  }, instanceIds => {
    const state: types.IState = context.api.store.getState();
    const gameMode = selectors.activeGameId(state);
    return util.getSafe(state.persistent.mods, [gameMode, instanceIds[0]], undefined) !== undefined;
  });

  context.registerAction('download-icons', 300, 'open-ext', {},
                         'Open in File Manager', () => {
    const store = context.api.store;
    (util as any).opn(selectors.downloadPath(store.getState())).catch(err => undefined);
  });

  return true;
}

function getGameInstallPath(state: any, game: types.IGame | string): Promise<string> {
  return new Promise((resolve, reject) => {
    let discoveredPath: string;
    if (typeof(game) === 'string') {
      discoveredPath = util.getSafe(state, ['settings', 'gameMode', 'discovered', game, 'path'], undefined);
    } else {
      discoveredPath = util.getSafe(state, ['settings', 'gameMode', 'discovered', game.id, 'path'], undefined);
    }
    resolve(discoveredPath);
  })
}

function openPath(mainPath: string, fallbackPath?: string) {
  fs.statAsync(mainPath)
    .then(() => (util as any).opn(mainPath).catch(e => undefined))
    .catch(e => fallbackPath !== undefined 
      ? (util as any).opn(fallbackPath).catch(e => undefined)
      : undefined)
    .then(() => null);
}

export default init;
