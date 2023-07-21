const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CustomerSchema = new Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: false
    },
    address: {
        type: String,
        required: true,
    },
    apartment: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: true,
    },
    image:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Upload",
        required: false,
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

const Customer = mongoose.model('Customer', CustomerSchema)

module.exports = Customer