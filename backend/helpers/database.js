const mongoose = require('mongoose')
const createError = require('http-errors')
const Organization = require('../models/organization.model')
const User = require('../models/user.model')
const Role = require('../models/role.model')
const {categorySchemaJOI} = require("../helpers/validationSchema");
const {userSchemaJOI} = require("./validationSchema");

console.log(process.env.MONGODB_URI)
console.log(process.env.dbName)
mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.dbName,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        console.log('mongodb connected')
    })
    .catch(err => console.log(err.message))

mongoose.connection.on('connected', () => {
    console.log("Mongoose connected to db")
    initial()
    initOrg()
})

mongoose.connection.on('error', (err) => {
    console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected...')
})

process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
})

async function initOrg(){
    if(process.env.ORGANIZATION){
        const doesExists = await Organization.findOne({ username: process.env.ORGANIZATION })
        if(!doesExists){
            const org = new Organization({
                username:process.env.ORGANIZATION,
                name:process.env.ORGANIZATION
            })
            let savedOrg = await org.save()
            initUser(savedOrg._id)

        }
    }
    else{
        const doesExists = await Organization.findOne({ username: 'rpnepal' })
        if(!doesExists){
            const org = new Organization({
                username:'ecom',
                name:'ecom'
            })
            let savedOrg = await org.save()
            initUser(savedOrg._id)
        }
    }
}

async function initUser(id){
    if(process.env.EMAIL && process.env.PASSWORD){
        let result = {
            email:process.env.EMAIL,
            password:process.env.PASSWORD,
            full_name:"Admin User",
            gender:"male",
            organization_id:id,
            facial_login_enrolled: false
        }
        result['roles'] = ["master","user"]
        const doesExists = await User.findOne({ email: result.email })
        if(!doesExists){
            Role.find({
                    name:{$in: result.roles}
                },
                async (err, roles)=>{
                    result.roles = roles.map(role => role._id);
                    const isValidated = await userSchemaJOI.validateAsync(result)
                    const user = new User(isValidated)
                    user.save()
                }
            )
        }
    }

}

function initial(){
    let roles = ['master','staff','user']
    for(let role in roles){
        new Role({
            name: roles[role]
        }).save((dat,err)=>{
            console.log("Added");
        })
    }
    
}
