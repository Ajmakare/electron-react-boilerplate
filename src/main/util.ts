/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { app } from 'electron';

export const resolveHtmlPath = (relativePath: string) => {
  return app.isPackaged
    ? path.join(process.resourcesPath, relativePath)
    : path.join(__dirname, '../../', relativePath);
};
