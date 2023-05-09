import { IFile } from 'safe-shore-common';
import DbService from '../services/db.service';

import _ from 'lodash';
import { Tables } from '../constants';

const db = new DbService();

export const fileModel = {
  createFile: async (
    newFile: Record<string, string | number | boolean>
  ): Promise<IFile> => {
    try {
      const file = await db.insert(Tables.FILES, newFile);
      return file?.[0];
    } catch (error) {
      console.error('ERROR in file.modal createFile()', error.message);
      throw {
        message: `error while trying to createFile. error: ${error.message}`,
      };
    }
  },
};
