import _ from 'lodash'
import { IFile } from 'safe-shore-common'

import { Tables } from '../constants'
import DbService from '../services/db.service'

const db = new DbService()

export const fileModel = {
  createFile: async (newFile: Record<string, string | number | boolean>): Promise<IFile> => {
    try {
      const file = await db.insert(Tables.FILES, newFile)
      return file?.[0]
    } catch (error) {
      console.error('ERROR in file.modal createFile()', error.message)
      throw {
        message: `error while trying to createFile. error: ${error.message}`
      }
    }
  },
  updateFiles: async (condition: Record<string, any> | string, updatedFile: Record<string, any>): Promise<IFile[]> => {
    try {
      const files = await db.update(Tables.FILES, updatedFile, condition)
      return files
    } catch (error) {
      console.error('ERROR in fileModel.modal updateFiles()', error.message)
      throw {
        message: `error while trying to updateFiles. error: ${error.message}`
      }
    }
  }
}
