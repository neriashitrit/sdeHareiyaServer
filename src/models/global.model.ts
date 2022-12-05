import DbService from '../services/db.service'

import _ from 'lodash'

export default class GlobalModel {
  db: DbService

  constructor() {
    this.db = new DbService()
  }

  // createImage = async (schemaName:string, tableName:string, key:string, url: string) =>{
  //   const image = await this.db.insert(schemaName,tableName, [{url, key}])
  //   return image[0]
  // }

  // updateImageReference = async (schemaName:string, tableName:string, id:number, image_id:number) =>{
  //   const user = await this.db.update(schemaName,tableName, {image_id}, {id})
  //   return user
  // }
  
  // getImage = async (schemaName:string, tableName:string, id: number): Promise<any> =>{
  //   const imageWithUser = await db.withSchema(schemaName).select()
  //   .from(tableName)
  //   .join('image', { [`image.id`]: `${tableName}.image_id` })
  //   .where(`${tableName}.id`, id)
  //   .first()
  //   return imageWithUser
  // }
}
