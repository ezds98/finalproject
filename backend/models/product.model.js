const mongoose = require("mongoose")
const {bool} = require("jshint/src/options");
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    sub_category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubCategory"
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Author"
    },
    organization_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Organization",
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    purchaseCount: {
        type:Number,
        default: 0
    },
    name:{
        type:String,
        required:true
    },
    isbn:{
        type:String,
        required:false,
        default:""
    },
    description:{
        type:String,
    },
    is_featured: {
        type:Boolean,
        required:true,
        default:false
    },
    images:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Upload",
        required:true
    }],
    price:{
        type:Number,
        required:true,
        default:0
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

ProductSchema.index({name: 'text'});
ProductSchema.index({isbn: 'text'});

const Product = mongoose.model('Product',ProductSchema)

module.exports = Product