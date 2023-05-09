import { Request, Response } from 'express';

import { productCategoryModel, productPropertyModel } from '../models/index';

import { failureResponse, successResponse } from '../utils/db.utils';
import { isCreateProductCategoryBody } from '../utils/typeCheckers.utils';
import fileHelper from '../helpers/file.helper';
import { Tables } from '../constants';
import _ from 'lodash';
import { productSubcategoryModel } from '../models/productSubcategory.model';
import { IProductProperty } from 'safe-shore-common';

export const getActiveProductCategories = async (
  req: Request,
  res: Response
) => {
  try {
    const productCategories = await productCategoryModel.getProductCategories({
      'pc.isActive': true,
    });
    return res.status(200).json(successResponse(productCategories));
  } catch (error: any) {
    console.log(error);
    return res.status(500).json(failureResponse(error));
  }
};

export const createProductCategories = async (req: Request, res: Response) => {
  try {
    let body: any;
    try {
      body = {
        ...req.body,
        subcategories: JSON.parse(req.body.subcategories),
        properties: JSON.parse(req.body.properties),
        icon: req.files?.icon,
      };
      const files = req.files;
      if (!_.isNil(files)) {
        Object.keys(files).forEach((key) => {
          if (key.includes('.')) {
            body.subcategories[+key.substring(0, key.indexOf('.'))].icon =
              files[key];
          }
        });
      }
    } catch (error) {
      return res.status(400).json(failureResponse('Invalid Parameters'));
    }

    if (!isCreateProductCategoryBody(body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'));
    }

    const { name, icon, description, properties, subcategories } = body;

    const productCategory = await productCategoryModel.createProductCategory({
      name,
      description,
    });

    const productCategoryIcon = await fileHelper.uploadFile(
      Tables.PRODUCT_CATEGORIES,
      productCategory.id,
      icon
    );

    properties.forEach(
      (property: Partial<IProductProperty>) =>
        (property.productCategoryId = productCategory.id)
    );

    const productCategoryProperties =
      await productPropertyModel.createProductProperties(properties);

    const productSubcategories =
      await productSubcategoryModel.createProductSubcategories(
        subcategories.map((subcategory) => ({
          name: subcategory.name,
          description: subcategory.description,
          productCategoryId: productCategory.id,
        }))
      );

    for (const productSubcategory of productSubcategories) {
      productSubcategory.icon = (
        await fileHelper.uploadFile(
          Tables.PRODUCT_SUBCATEGORIES,
          productSubcategory.id,
          icon
        )
      ).url;
    }

    productCategory.icon = productCategoryIcon.url;
    productCategory.properties = productCategoryProperties;
    productCategory.subcategories = productSubcategories;

    return res.status(201).json(successResponse(productCategory));
  } catch (error: any) {
    console.log(error);
    return res.status(500).json(failureResponse(error));
  }
};
