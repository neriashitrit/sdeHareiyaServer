import DbService from '../services/db.service';

import { Tables } from '../constants';
import { IProductCategory } from 'safe-shore-common';
import { getJsonBuildObject } from '../utils/db.utils';

const db = new DbService();

export const productCategoryModel = {
  getProductCategories: async (
    condition: Record<string, any> | string
  ): Promise<IProductCategory[]> => {
    try {
      const productCategories = await db.knex
        .queryBuilder()
        .select(
          'pc.id',
          'pc.name',
          'pc.description',
          'pcf.url as icon',
          'pc.updated_at',
          'pc.created_at',
          db.knex.raw(
            `JSON_AGG(JSON_BUILD_OBJECT(${getJsonBuildObject(
              Tables.PRODUCT_PROPERTIES,
              ['pp']
            )})) as properties`
          ),
          db.knex
            .select(
              db.knex.raw(
                `JSON_AGG(JSON_BUILD_OBJECT(${getJsonBuildObject(
                  Tables.PRODUCT_SUBCATEGORIES,
                  ['psc', 'pscf']
                )})) as subcategories`
              )
            )
            .from(`${Tables.PRODUCT_SUBCATEGORIES} as psc`)
            .leftJoin(`${Tables.FILES} as pscf`, function () {
              this.on('psc.id', '=', 'pscf.row_id').andOn(
                'pscf.table_name',
                '=',
                db.knex.raw('?', [Tables.PRODUCT_SUBCATEGORIES])
              );
            })
            .where(db.knex.raw('psc.product_category_id = pc.id'))
            .as('subcategories')
        )
        .from(`${Tables.PRODUCT_CATEGORIES} as pc`)
        .leftJoin(
          `${Tables.PRODUCT_PROPERTIES} as pp`,
          'pp.product_category_id',
          '=',
          'pc.id'
        )
        .leftJoin(`${Tables.FILES} as pcf`, function () {
          this.on('pc.id', '=', 'pcf.row_id').andOn(
            'pcf.table_name',
            '=',
            db.knex.raw('?', [Tables.PRODUCT_CATEGORIES])
          );
        })
        .where(condition)
        .groupBy('pc.id', 'pcf.id');
      return productCategories;
    } catch (error) {
      console.error(
        'ERROR in productCategoryModel.modal getProductCategories()',
        error.message
      );
      throw {
        message: `error while trying to getProductCategories. error: ${error.message}`,
      };
    }
  },
  createProductCategory: async (
    newProductCategory: Record<string, any>
  ): Promise<IProductCategory> => {
    try {
      const ProductCategory = await db.insert(Tables.PRODUCT_CATEGORIES, [
        newProductCategory,
      ]);
      return ProductCategory?.[0];
    } catch (error) {
      console.error(
        'ERROR in productCategoryModel.modal createProductCategory()',
        error.message
      );
      throw {
        message: `error while trying to createProductCategory. error: ${error.message}`,
      };
    }
  },
};
