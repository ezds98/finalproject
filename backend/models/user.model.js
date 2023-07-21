const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const userContactSchema = new Schema({
    country:{
        type:String,
        default:'nepal'
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    street:{
        type:String
    },
    near_reference:{
        type:String
    },
    gps_coordinates:{
        type:String
    }
})

const nestedAnalytics = new Schema({
    name:{
        type:String
    },
    count:{
        type:Number
    }
})

const nestedCollectionAnalytics = new Schema({
    col:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection"
    },
    count:{
        type:Number
    }
})
const nestedCategoryAnalytics = new Schema({
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    count:{
        type:Number
    }
})

const userAnalytics = new Schema({
    searched_data:[nestedAnalytics],
    viewed_collections:[nestedCollectionAnalytics],
    viewed_categories:[nestedCategoryAnalytics]
})

const UserSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    full_name:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required: false
    },
    facial_login_enrolled: {
        type: Boolean,
        required: true,
        default: false
    },
    facialId: {
        type:String,
        required: false
    },
    user_contact:{
        type: userContactSchema,
        required: false
    },
    roles:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ],
    organization_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
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

UserSchema.pre('save', async function (next) {
    try {
        if(this.password !== '' && !this.is_external_register){
            const salt = await bcrypt.genSalt(10)
            this.password = await bcrypt.hash(this.password, salt)
        }
        next()
    } catch (error) {
        next(error)
    }

})

UserSchema.post('save', async function (next) {
    try {
        console.log("called after saving user")
    } catch (error) {
        next(error)
    }

})

UserSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

const User = mongoose.model('User', UserSchema)

module.exports = User