import { IUser } from '../types/user';
import DbService from '../services/db.service';

import _ from 'lodash';

export default class UserModel {
  db: DbService;

  constructor() {
    this.db = new DbService();
  }

  getUser = async (email: string): Promise<any> => {
    const last_login = new Date();
    try {
      const user = await this.db.update('users', { last_login }, { email });
      return user?.[0];
    } catch (error) {
      console.error('ERROR in users.modal getUser()', error.message);
    }
  };

  createUser = async (newUser: any): Promise<IUser> => {
    const user = await this.db.insert('users', newUser);
    return user?.[0];
  };
}
