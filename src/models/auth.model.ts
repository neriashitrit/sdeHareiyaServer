import DbService from '../services/db.service'


export default class AuthModel {
  db: DbService

  constructor() {
    this.db = new DbService()
  }

  getHashedPassword = async (company_name: string): Promise<string> =>{
    console.log('in getHashedPassword');
    return 'HashedPassword'
  }
  
}
