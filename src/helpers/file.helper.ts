import { Tables } from '../constants';
import { fileModel } from '../models/file.model';

const fileHelper = {
  uploadFile: async (tableName: Tables, rowId: number, file: File) => {
    //  TODO upload to azure
    return await fileModel.createFile({
      azureKey: 'AZURE_KEY',
      url: 'AZURE_FILE_URL',
      tableName,
      rowId,
    });
  },
};

export default fileHelper;
