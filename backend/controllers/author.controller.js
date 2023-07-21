const Author = require('../models/author.model.js')
const  {authorSchemaJoi} = require('../helpers/validationSchema')

module.exports = {
    register: async (req,res) =>{
        try{
            req.body["organization_id"] = res.locals.payload.organization
            const isValidated = await authorSchemaJoi.validateAsync(req.body)
            const doesExists = await Author.findOne({ name: req.body.name, organization_id: res.locals.payload.organization, deleted_at:null })
            if (doesExists) return res.status(400).json({message: "Name Already Exists"})
            const author = new Author(isValidated)
            const newAuthor = await author.save()
            return res.status(201).json(newAuthor)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    update: async (req,res)=>{
        try{
            req.body["organization_id"] = res.locals.payload.organization
            const isValidated = await authorSchemaJoi.validateAsync(req.body)
            const author = await Author.findByIdAndUpdate(req.params.id,{"$set":isValidated})
            return res.status(201).json(author)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    delete: async (req,res)=>{
        try{
            const author = await Author.findByIdAndUpdate(req.params.id,{"$set":{deleted_at:new Date()}})
            return res.status(201).json(author)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    get_all: async (req,res)=>{
        try {
            const authors = await Author.find({deleted_at:null})
            return res.status(201).json(authors)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    search: async (req,res)=>{
        try {
            let search = await Author.find({
                deleted_at: null,
                "name": {"$regex": req.params.search, "$options": "i"}
            }).limit(12)
            return res.status(201).json(search)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    get_by_id: async (req,res)=>{
        try {
            const author = await Author.findOne({_id:req.params.id,deleted_at:null})
            return res.status(201).json(author)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    }
}