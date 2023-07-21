const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SubCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Upload"
    },
    description:{
        type:String
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    organization_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"organization",
        required:true
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

const SubCategory = mongoose.model('SubCategory', SubCategorySchema)

module.exports = SubCategory