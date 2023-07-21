const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CategorySchema = new Schema({
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
    organization_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Organization",
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

const Category = mongoose.model('Category', CategorySchema)

module.exports = Category