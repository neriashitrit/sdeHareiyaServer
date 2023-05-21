import { IProductCategory } from 'safe-shore-common'

import { Tables } from '../constants'
import DbService from '../services/db.service'
import { getJsonBuildObject } from '../utils/db.utils'

const db = new DbService()

export const productCategoryModel = {
  getProductCategories: async (condition: Record<string, any> | string): Promise<IProductCategory[]> => {
    try {
      const productCategories = await db.knex
        .queryBuilder()
        .select(
          `${Tables.PRODUCT_CATEGORIES}.*`,
          `${Tables.PRODUCT_CATEGORIES}.id`,
          `${Tables.PRODUCT_CATEGORIES}.name`,
          `${Tables.PRODUCT_CATEGORIES}.description`,
          'product_category_file.url as icon',
          `${Tables.PRODUCT_CATEGORIES}.updated_at`,
          `${Tables.PRODUCT_CATEGORIES}.created_at`,
          db.knex.raw(
            `JSON_AGG(JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.PRODUCT_PROPERTIES, [
              Tables.PRODUCT_PROPERTIES
            ])})) AS properties`
          ),
          db.knex
            .select(
              db.knex.raw(
                `JSON_AGG(JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.PRODUCT_SUBCATEGORIES, [
                  Tables.PRODUCT_SUBCATEGORIES,
                  'product_subcategory_file'
                ])})) AS subcategories`
              )
            )
            .from(Tables.PRODUCT_SUBCATEGORIES)
            .leftJoin(`${Tables.FILES} AS product_subcategory_file`, function () {
              this.on(`${Tables.PRODUCT_SUBCATEGORIES}.id`, 'product_subcategory_file.row_id').andOn(
                'product_subcategory_file.table_name',
                db.knex.raw(`'${Tables.PRODUCT_SUBCATEGORIES}'`)
              )
            })
            .where(db.knex.raw(`${Tables.PRODUCT_SUBCATEGORIES}.product_category_id = ${Tables.PRODUCT_CATEGORIES}.id`))
            .as('subcategories')
        )
        .from(`${Tables.PRODUCT_CATEGORIES}`)
        .leftJoin(
          Tables.PRODUCT_PROPERTIES,
          `${Tables.PRODUCT_PROPERTIES}.product_category_id`,
          `${Tables.PRODUCT_CATEGORIES}.id`
        )
        .leftJoin(`${Tables.FILES} AS product_category_file`, function () {
          this.on(`${Tables.PRODUCT_CATEGORIES}.id`, 'product_category_file.row_id').andOn(
            'product_category_file.table_name',
            db.knex.raw(`'${Tables.PRODUCT_CATEGORIES}'`)
          )
        })
        .where(condition)
        .groupBy(`${Tables.PRODUCT_CATEGORIES}.id`, 'product_category_file.id')

      return productCategories
    } catch (error) {
      console.error('ERROR in productCategoryModel.modal getProductCategories()', error.message)
      throw {
        message: `error while trying to getProductCategories. error: ${error.message}`
      }
    }
  },
  createProductCategory: async (newProductCategory: Record<string, any>): Promise<IProductCategory> => {
    try {
      const ProductCategory = await db.insert(Tables.PRODUCT_CATEGORIES, [newProductCategory])
      return ProductCategory?.[0]
    } catch (error) {
      console.error('ERROR in productCategoryModel.modal createProductCategory()', error.message)
      throw {
        message: `error while trying to createProductCategory. error: ${error.message}`
      }
    }
  }
}
