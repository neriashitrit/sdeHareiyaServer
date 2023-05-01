import DbService from '../services/db.service';

const db = new DbService();

export const authModel = {
  getHashedPassword: async (company_name: string): Promise<string> => {
    console.log('in getHashedPassword');
    return 'HashedPassword';
  },
};
