const mongoose = require("mongoose")
const Schema = mongoose.Schema

const RoleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
})

RoleSchema.pre('save', async function (next) {
    try{
        let isFound = await Role.findOne({name : this.name})
        if(isFound){
            console.log("Role Already Exists")
        }
        else {
            next()
        }
    }
    catch (error) {
        next(error)
    }
})

const Role = mongoose.model('Role', RoleSchema)

module.exports = Role