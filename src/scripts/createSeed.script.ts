import { Tables } from '../constants'
import DbService from '../services/db.service'

const run = async () => {
  const db = new DbService()
  const commissions = await db.getAll(Tables.COMMISSIONS, {})
  if (commissions.length === 0) {
    await db.insert(Tables.COMMISSIONS, [
      {
        isActive: true,
        from: 1000,
        to: 10000,
        type: 'percentage',
        amount: 3.5
      },
      {
        isActive: true,
        from: 10001,
        to: 50000,
        type: 'percentage',
        amount: 2.5
      },
      {
        isActive: true,
        from: 50001,
        to: 100000,
        type: 'percentage',
        amount: 2
      },
      {
        isActive: true,
        from: 100001,
        to: 250000,
        type: 'percentage',
        amount: 1.5
      },
      {
        isActive: true,
        from: 250000,
        type: 'percentage',
        amount: 1
      }
    ])
  }
  const productCategories = await db.getAll(Tables.PRODUCT_CATEGORIES, {})
  if (productCategories.length === 0) {
    await db.insert(Tables.PRODUCT_CATEGORIES, [
      {
        name: 'cars',
        description: 'lorem ipsum'
      },
      {
        name: 'pets',
        description: 'lorem ipsum'
      },
      {
        name: 'electronics',
        description: 'lorem ipsum'
      },
      {
        name: 'luxury',
        description: 'lorem ipsum'
      },
      {
        name: 'online',
        description: 'lorem ipsum'
      },
      {
        name: 'other',
        description: 'lorem ipsum'
      }
    ])
    await db.insert(Tables.FILES, [
      {
        azureKey: 'KEY',
        url: 'https://google.com',
        tableName: Tables.PRODUCT_CATEGORIES,
        rowId: 1
      },
      {
        azureKey: 'KEY',
        url: 'https://google.com',
        tableName: Tables.PRODUCT_CATEGORIES,
        rowId: 2
      },
      {
        azureKey: 'KEY',
        url: 'https://google.com',
        tableName: Tables.PRODUCT_CATEGORIES,
        rowId: 3
      },
      {
        azureKey: 'KEY',
        url: 'https://google.com',
        tableName: Tables.PRODUCT_CATEGORIES,
        rowId: 4
      },
      {
        azureKey: 'KEY',
        url: 'https://google.com',
        tableName: Tables.PRODUCT_CATEGORIES,
        rowId: 5
      },
      {
        azureKey: 'KEY',
        url: 'https://google.com',
        tableName: Tables.PRODUCT_CATEGORIES,
        rowId: 6
      }
    ])
  }
  const productSubcategories = await db.getAll(Tables.PRODUCT_SUBCATEGORIES, {})
  if (productSubcategories.length === 0) {
    await db.insert(Tables.PRODUCT_SUBCATEGORIES, [
      {
        productCategoryId: 1,
        name: 'private',
        description: 'lorem ipsum'
      },
      {
        productCategoryId: 1,
        name: 'commercial',
        description: 'lorem ipsum'
      },
      {
        productCategoryId: 1,
        name: 'jeep',
        description: 'lorem ipsum'
      },
      {
        productCategoryId: 1,
        name: 'motorcycle',
        description: 'lorem ipsum'
      },
      {
        productCategoryId: 1,
        name: 'scooter',
        description: 'lorem ipsum'
      },
      {
        productCategoryId: 1,
        name: 'boat',
        description: 'lorem ipsum'
      },
      {
        productCategoryId: 1,
        name: 'special',
        description: 'lorem ipsum'
      },
      {
        productCategoryId: 1,
        name: 'truck',
        description: 'lorem ipsum'
      },
      {
        productCategoryId: 1,
        name: 'other',
        description: 'lorem ipsum'
      }
    ])
    await db.insert(Tables.FILES, [
      {
        azureKey: 'KEY',
        url: 'https://google.com',
        tableName: Tables.PRODUCT_SUBCATEGORIES,
        rowId: 1
      },
      {
        azureKey: 'KEY',
        url: 'https://google.com',
        tableName: Tables.PRODUCT_SUBCATEGORIES,
        rowId: 2
      },
      {
        azureKey: 'KEY',
        url: 'https://google.com',
        tableName: Tables.PRODUCT_SUBCATEGORIES,
        rowId: 3
      },
      {
        azureKey: 'KEY',
        url: 'https://google.com',
        tableName: Tables.PRODUCT_SUBCATEGORIES,
        rowId: 4
      },
      {
        azureKey: 'KEY',
        url: 'https://google.com',
        tableName: Tables.PRODUCT_SUBCATEGORIES,
        rowId: 5
      },
      {
        azureKey: 'KEY',
        url: 'https://google.com',
        tableName: Tables.PRODUCT_SUBCATEGORIES,
        rowId: 6
      }
    ])
  }
  const productProperties = await db.getAll(Tables.PRODUCT_PROPERTIES, {})
  if (productProperties.length === 0) {
    await db.insert(Tables.PRODUCT_PROPERTIES, [
      {
        productCategoryId: 1,
        name: 'type',
        type: 'text',
        label: 'type',
        validation: '{"required": true, "requiredMessage": "typeRequired","type": "string"}'
      },
      {
        productCategoryId: 1,
        name: 'manufacturer',
        type: 'text',
        label: 'manufacturer',
        validation: '{"required": true, "requiredMessage": "manufacturerRequired","type": "string"}'
      },
      {
        productCategoryId: 1,
        name: 'model',
        type: 'text',
        label: 'model',
        validation: '{"required": true, "requiredMessage": "modelRequired","type": "string"}'
      },
      {
        productCategoryId: 1,
        name: 'licenseNo',
        type: 'text',
        label: 'licenseNo',
        validation: '{"required": true, "requiredMessage": "licenseNoRequired","type": "number"}'
      },
      {
        productCategoryId: 1,
        name: 'manufactureYear',
        type: 'text',
        label: 'manufactureYear',
        validation: '{"required": true, "requiredMessage": "manufactureYearRequired","type": "number"}'
      },
      {
        productCategoryId: 1,
        name: 'licenseImages',
        type: 'file',
        label: 'licenseImages',
        validation: '{"required": true, "requiredMessage": "licenseImagesRequired"}',
        multipleFiles: true
      },
      {
        productCategoryId: 2,
        name: 'type',
        type: 'text',
        label: 'type',
        validation: '{"required": true, "requiredMessage": "typeRequired","type": "string"}'
      },
      {
        productCategoryId: 2,
        name: 'manufacturer',
        type: 'text',
        label: 'manufacturer',
        validation: '{"required": true, "requiredMessage": "manufacturerRequired","type": "string"}'
      },
      {
        productCategoryId: 2,
        name: 'color',
        type: 'text',
        label: 'color',
        validation: '{"required": true, "requiredMessage": "colorRequired","type": "string"}'
      },
      {
        productCategoryId: 3,
        name: 'type',
        type: 'text',
        label: 'type',
        validation: '{"required": true, "requiredMessage": "typeRequired","type": "string"}'
      },
      {
        productCategoryId: 3,
        name: 'age',
        type: 'text',
        label: 'age',
        validation: '{"required": true, "requiredMessage": "ageRequired","type": "number"}'
      },
      {
        productCategoryId: 3,
        name: 'breed',
        type: 'text',
        label: 'breed',
        validation: '{"required": true, "requiredMessage": "breedRequired","type": "string"}'
      },
      {
        productCategoryId: 3,
        name: 'gender',
        type: 'select',
        label: 'gender',
        selectOptions: ['male', 'female'],
        validation: '{"required": true, "requiredMessage": "genderRequired","type": "string"}'
      },
      {
        productCategoryId: 4,
        name: 'type',
        type: 'text',
        label: 'type',
        validation: '{"required": true, "requiredMessage": "typeRequired","type": "string"}'
      },
      {
        productCategoryId: 4,
        name: 'serviceDescription',
        type: 'text',
        label: 'serviceDescription',
        lineCountText: 4,
        validation: '{"required": true, "requiredMessage": "serviceDescriptionRequired","type": "string"}'
      },
      {
        productCategoryId: 5,
        name: 'type',
        type: 'text',
        label: 'type',
        validation: '{"required": true, "requiredMessage": "typeRequired","type": "string"}'
      },
      {
        productCategoryId: 5,
        name: 'manufacturer',
        type: 'text',
        label: 'manufacturer',
        validation: '{"required": true, "requiredMessage": "manufacturerRequired","type": "string"}'
      },
      {
        productCategoryId: 5,
        name: 'model',
        type: 'text',
        label: 'model',
        validation: '{"required": true, "requiredMessage": "modelRequired","type": "string"}'
      },
      {
        productCategoryId: 6,
        name: 'type',
        type: 'text',
        label: 'type',
        validation: '{"required": true, "requiredMessage": "typeRequired","type": "string"}'
      },
      {
        productCategoryId: 6,
        name: 'serviceDescription',
        type: 'text',
        label: 'serviceDescription',
        lineCountText: 6,
        validation: '{"required": true, "requiredMessage": "serviceDescriptionRequired","type": "string"}'
      }
    ])
  }
}

run()
  .then(() => {
    console.log('run seed successfully')
    process.exit(0)
  })
  .catch((err: any) => {
    console.log(err)
    process.exit(1)
  })
