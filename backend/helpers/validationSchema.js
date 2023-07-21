const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

const authorSchemaJoi = Joi.object({
    name:Joi.string().required(),
    organization_id:Joi.objectId().required(),
    location:Joi.string().default('').optional(),
    description:Joi.string().default('').optional(),
    image:Joi.objectId().optional(),
})

const categorySchemaJOI = Joi.object({
    name:Joi.string().required(),
    organization_id:Joi.objectId().required(),
    image:Joi.objectId().optional(),
    description:Joi.string().default('').optional(),
})

const subCategorySchemaJOI = Joi.object({
    name:Joi.string().required(),
    organization_id:Joi.objectId().required(),
    image:Joi.objectId().optional(),
    category:Joi.objectId().required(),
    description:Joi.string().default('').optional(),
})


const customerSchemaJOI = Joi.object({
    user_id: Joi.objectId().required(),
    organization_id:Joi.objectId().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().allow("").allow(null),
    email: Joi.string().required(),
    address: Joi.string().required(),
    apartment: Joi.string().optional().allow("").allow(null),
    city: Joi.string().required(),
    state: Joi.string().optional().allow("").allow(null),
    phone: Joi.string().required(),
    image: Joi.string().allow(null).allow(""),
})

const productSchemaJOI = Joi.object({
    user_id: Joi.objectId().required(),
    category:Joi.objectId().required(),
    sub_category:Joi.objectId().optional(),
    organization_id:Joi.objectId().required(),
    stock:Joi.number().min(0),
    name:Joi.string().required(),
    description:Joi.string().optional(),
    images:Joi.array().optional(),
    price:Joi.number().min(0),
    is_featured:Joi.boolean().default(false)
})

const salesSchemaJOI = Joi.object({
    user_id: Joi.objectId().allow("").allow(null),
    products:Joi.array().items(
        Joi.object({
            product:Joi.objectId().required(),
            total:Joi.number().min(0).required(),
            price:Joi.number().min(0).required(),
            quantity:Joi.number().default(1).required(),

        })
    ).required(),
    total_amount:Joi.number().min(0).required(),
    customer_id:Joi.objectId().required(),
    organization_id:Joi.objectId().required(),
    payment_type:Joi.string().valid('cash','credit','paypal').default('cash').allow("").allow(null),
})

const uploadSchemaJOI = Joi.object({
    organization_id:Joi.objectId().required(),
    path:Joi.string().required(),
    type:Joi.string().required(),
})

const userSchemaJOI = Joi.object({
    email:Joi.string().email(),
    password:Joi.string().required(),
    full_name:Joi.string().required(),
    gender:Joi.string().allow('').allow(null),
    facial_login_enrolled:Joi.boolean().required(),
    facialId:Joi.string().allow('').allow(null),
    user_contact:Joi.object({
        country:Joi.string().allow('').allow(null).default('nepal'),
        city:Joi.string().allow('').allow(null),
        state:Joi.string().allow('').allow(null),
        street:Joi.string().allow('').allow(null),
        near_reference:Joi.string().allow('').allow(null),
    }).allow('').allow(null),
    roles:Joi.array().items(Joi.objectId()).required(),
    organization_id:Joi.objectId().required(),
})

const authSchemaJOI = Joi.object({
    email:Joi.string().allow('').allow(null),
    password:Joi.string().allow('').allow(null),
    facialId:Joi.string().allow('').allow(null)
})

const commentSchemaJOI = Joi.object({
    user_id:Joi.objectId().required(),
    product_id:Joi.objectId().required(),
    has_rated:Joi.boolean().required(),
    rating:Joi.number().min(0).max(5).optional(),
    details:Joi.string().optional(),
    organization_id:Joi.objectId().required(),
})

module.exports = {
    authSchemaJOI,
    authorSchemaJoi,
    categorySchemaJOI,
    subCategorySchemaJOI,
    productSchemaJOI,
    salesSchemaJOI,
    uploadSchemaJOI,
    userSchemaJOI,
    commentSchemaJOI,
    customerSchemaJOI
}