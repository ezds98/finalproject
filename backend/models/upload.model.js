const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UploadSchema = new Schema({
    path: {
        type: String,
        required: true,
    },
    type:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    organization_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"organization",
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

const Upload = mongoose.model('uploads', UploadSchema)

module.exports = Upload