const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Product = require('./product.model')

const productDetailsSchema = new Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    total:{
        type:Number,
        required:true
    },
    price: {
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        default:1,
        required:true
    },
})

const SalesSchema = new Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    products:[productDetailsSchema],
    total_amount:{
        type:Number,
        required:true
    },
    customer_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customer",
        required:true
    },
    organization_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"organization",
        required:true
    },
    invoice_date:{
        type:Date,
        required:true,
        default:Date.now()
    },
    payment_type:{
        type:String,
        enum:['cash','credit','paypal'],
        default:"cash",
        required:false
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    updated_at:{
        type:Date,
        default:Date.now()
    },
    deleted_at:{
        type:Date,
        default:null
    },
})

//create a pre hook to check for isPaid

const Sales = mongoose.model('Sales',SalesSchema)

module.exports = Sales