// import jwt from 'jsonwebtoken'

// import DbService from '../services/db.service'
// import { TRUSTNET_TABLES } from '../constants'
// import { IUser } from '../types'

// export default class UserModel {
//   db: DbService

//   constructor() {
//     this.db = new DbService()
//   }

//   create = async (firstName: string, lastName: string, username: string): Promise<void> =>
//     this.db.insertOne('public', TRUSTNET_TABLES.USERS, {
//       firstName,
//       lastName,
//       username
//     })

//   getByUsername = (username: string): Promise<IUser> => this.db.getOne(TRUSTNET_TABLES.USERS, { username })

//   getById = (id: number): Promise<IUser> => this.db.getOneByIdOrExternalId(TRUSTNET_TABLES.USERS, id)

//   getSignedJwtToken = async (user: IUser): Promise<any> =>
//     jwt.sign(
//       {
//         id: user.id,
//         username: user.username,
//         firstName: user.firstName,
//         lastName: user.lastName
//       },
//       process.env.JWT_SECRET as string,
//       { expiresIn: process.env.JWT_EXPIRES_IN || '60m' }
//     )

//   update = (id: number, user: Partial<IUser>): Promise<any> => this.db.updateOneById(TRUSTNET_TABLES.USERS, user, id)
// }
