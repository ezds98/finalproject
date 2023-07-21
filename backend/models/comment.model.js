const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    has_rated:{
        type:Boolean,
        required:true
    },
    rating:{
        type:Number,
        default:0,
        max:5,
        min:0
    },
    details:{
        type:String,
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    organization_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Organization",
        required:true
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

const Collection = mongoose.model('Comment', CommentSchema)

module.exports = Collection