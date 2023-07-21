const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AuthorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    organization_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Organization",
        required:true
    },
    location:{
        type:String,
        default:''
    },
    description:{
        type:String,
        default:''
    },
    image:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Upload",
    },
    created_at:{
        type:Date,
        default: new Date()
    },
    updated_at:{
        type:Date,
        default:new Date()
    },
    deleted_at:{
        type:Date,
        default:null
    },
})

const Author = mongoose.model('Author', AuthorSchema)

module.exports = Author