import DbService from '../services/db.service';

import { Tables } from '../constants';
import { IProductSubcategory } from 'safe-shore-common';

const db = new DbService();

export const productSubcategoryModel = {
  createProductSubcategories: async (
    newProductSubcategories: Record<string, any>[]
  ): Promise<IProductSubcategory[]> => {
    try {
      const ProductCategory = await db.insert(
        Tables.PRODUCT_SUBCATEGORIES,
        newProductSubcategories
      );
      return ProductCategory;
    } catch (error) {
      console.error(
        'ERROR in productSubcategoryModel.modal createProductSubcategories()',
        error.message
      );
      throw {
        message: `error while trying to createProductSubcategories. error: ${error.message}`,
      };
    }
  },
};
