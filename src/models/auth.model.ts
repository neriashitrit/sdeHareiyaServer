import DbService from '../services/db.service'

const db = new DbService()

export const authModel = {
  getHashedPassword: (company_name: string): string => {
    console.log('in getHashedPassword')
    return 'HashedPassword'
  }
}
